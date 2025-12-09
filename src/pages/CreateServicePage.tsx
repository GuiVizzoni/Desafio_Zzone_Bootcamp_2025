import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Upload, ChevronRight } from 'lucide-react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ServiceCategory } from '@/types/marketplace';
import { categoryLabels } from '@/data/mockData';
import { sendN8nEvent } from '@/lib/n8n';
import { supabase } from '@/lib/supabase';

interface PackageForm {
  name: string;
  description: string;
  price: string;
  deliveryDays: string;
  revisions: string;
  features: string[];
}

export default function CreateServicePage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ServiceCategory | ''>('');
  const [description, setDescription] = useState('');
  const [packages, setPackages] = useState<PackageForm[]>([
    { name: 'Básico', description: '', price: '', deliveryDays: '', revisions: '1', features: [''] },
  ]);

  const addPackage = () => {
    if (packages.length >= 3) return;
    setPackages([
      ...packages,
      { 
        name: packages.length === 1 ? 'Padrão' : 'Premium', 
        description: '', 
        price: '', 
        deliveryDays: '', 
        revisions: '2', 
        features: [''] 
      },
    ]);
  };

  const removePackage = (index: number) => {
    if (packages.length <= 1) return;
    setPackages(packages.filter((_, i) => i !== index));
  };

  const updatePackage = (index: number, field: keyof PackageForm, value: string | string[]) => {
    const updated = [...packages];
    updated[index] = { ...updated[index], [field]: value };
    setPackages(updated);
  };

  const addFeature = (packageIndex: number) => {
    const updated = [...packages];
    updated[packageIndex].features.push('');
    setPackages(updated);
  };

  const updateFeature = (packageIndex: number, featureIndex: number, value: string) => {
    const updated = [...packages];
    updated[packageIndex].features[featureIndex] = value;
    setPackages(updated);
  };

  const removeFeature = (packageIndex: number, featureIndex: number) => {
    const updated = [...packages];
    updated[packageIndex].features = updated[packageIndex].features.filter((_, i) => i !== featureIndex);
    setPackages(updated);
  };

  const handleSubmit = async () => {
    if (!title || !category || !description) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha todos os campos básicos.',
        variant: 'destructive',
      });
      return;
    }

    const hasValidPackage = packages.every(
      (pkg) => pkg.price && pkg.deliveryDays && pkg.features.some((f) => f.trim())
    );

    if (!hasValidPackage) {
      toast({
        title: 'Pacotes incompletos',
        description: 'Cada pacote precisa de preço, prazo e pelo menos uma feature.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Preparar dados do serviço
      const serviceData = {
        title,
        description,
        category,
        packages: packages.map(pkg => ({
          name: pkg.name,
          description: pkg.description,
          price: parseFloat(pkg.price),
          deliveryDays: parseInt(pkg.deliveryDays),
          revisions: parseInt(pkg.revisions),
          features: pkg.features.filter(f => f.trim() !== ''),
        })),
        createdAt: new Date().toISOString(),
      };

      // Enviar para n8n webhook (que depois envia para Supabase)
      const webhookSuccess = await sendN8nEvent('service_created', serviceData);

      // Também salvar diretamente no Supabase como backup
      const { data, error } = await supabase
        .from('services')
        .insert([serviceData])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        // Continua mesmo com erro do Supabase se o webhook funcionou
        if (!webhookSuccess) {
          throw new Error('Falha ao criar serviço');
        }
      }

      toast({
        title: 'Serviço criado!',
        description: 'Seu serviço foi publicado com sucesso.',
      });

      console.log('Service created:', data);
      console.log('Webhook sent:', webhookSuccess);

      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      console.error('Error creating service:', error);
      toast({
        title: 'Erro ao criar serviço',
        description: 'Tente novamente mais tarde.',
        variant: 'destructive',
      });
    }
  };

  return (
    <MobileLayout>
      <Header showBack title="Criar serviço" />

      <div className="p-4 space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <h2 className="font-display font-semibold">Informações básicas</h2>

          <div className="space-y-2">
            <Label htmlFor="title">Título do serviço *</Label>
            <Input
              id="title"
              placeholder="Ex: Edição profissional de Reels"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Categoria *</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as ServiceCategory)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(categoryLabels) as ServiceCategory[]).map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {categoryLabels[cat]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              placeholder="Descreva seu serviço, experiência e diferenciais..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px] resize-none"
            />
          </div>
        </div>

        {/* Portfolio */}
        <div className="space-y-4">
          <h2 className="font-display font-semibold">Portfólio</h2>
          <Button variant="outline" className="w-full h-24 border-dashed gap-2">
            <Upload className="h-5 w-5" />
            Adicionar imagens ou vídeos
          </Button>
          <p className="text-xs text-muted-foreground">
            Adicione exemplos do seu trabalho para atrair mais clientes
          </p>
        </div>

        {/* Packages */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold">Pacotes</h2>
            {packages.length < 3 && (
              <Button variant="outline" size="sm" onClick={addPackage}>
                <Plus className="h-4 w-4 mr-1" />
                Adicionar
              </Button>
            )}
          </div>

          {packages.map((pkg, pkgIndex) => (
            <Card key={pkgIndex}>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <Input
                    value={pkg.name}
                    onChange={(e) => updatePackage(pkgIndex, 'name', e.target.value)}
                    className="font-semibold border-0 p-0 h-auto text-base focus-visible:ring-0"
                    placeholder="Nome do pacote"
                  />
                  {packages.length > 1 && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-destructive"
                      onClick={() => removePackage(pkgIndex)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <Input
                  placeholder="Descrição curta do pacote"
                  value={pkg.description}
                  onChange={(e) => updatePackage(pkgIndex, 'description', e.target.value)}
                />

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Preço (R$) *</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={pkg.price}
                      onChange={(e) => updatePackage(pkgIndex, 'price', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Prazo (dias) *</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={pkg.deliveryDays}
                      onChange={(e) => updatePackage(pkgIndex, 'deliveryDays', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Revisões</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={pkg.revisions}
                      onChange={(e) => updatePackage(pkgIndex, 'revisions', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">O que está incluso</Label>
                  {pkg.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex gap-2">
                      <Input
                        placeholder="Ex: Cortes básicos"
                        value={feature}
                        onChange={(e) => updateFeature(pkgIndex, featureIndex, e.target.value)}
                      />
                      {pkg.features.length > 1 && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-10 w-10 flex-shrink-0"
                          onClick={() => removeFeature(pkgIndex, featureIndex)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => addFeature(pkgIndex)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Adicionar feature
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Button 
          className="w-full h-12 rounded-xl font-semibold"
          onClick={handleSubmit}
        >
          Publicar serviço
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </MobileLayout>
  );
}
