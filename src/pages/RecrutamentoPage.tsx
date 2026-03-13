import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Upload, Building2, User, Users, Briefcase } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { EmpresaForm } from "@/components/forms/EmpresaForm";
import { SocioPFForm } from "@/components/forms/SocioPFForm";
import { SocioPJForm } from "@/components/forms/SocioPJForm";
import { ProcuradorForm } from "@/components/forms/ProcuradorForm";
import { toast } from "@/hooks/use-toast";

interface DocumentBlock {
  id: string;
  name: string;
  uploaded: boolean;
}

interface Person {
  id: string;
  name: string;
  documents: DocumentBlock[];
  hasSpouse?: boolean;
  spouseDocuments?: DocumentBlock[];
}

interface EntityBlock {
  id: string;
  name: string;
  type: 'empresa' | 'socio_pf' | 'socio_pj' | 'procurador';
  documents?: DocumentBlock[];
  people?: Person[];
}

type FormStep = {
  type: 'documents' | 'empresa' | 'socio_pf' | 'socio_pj' | 'procurador';
  entityId?: string;
  personId?: string;
  personName?: string;
  hasSpouse?: boolean;
};

export default function RecrutamentoPage() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formSteps, setFormSteps] = useState<FormStep[]>([{ type: 'documents' }]);
  const [entities, setEntities] = useState<EntityBlock[]>([
    {
      id: "empresa-1",
      name: "Empresa",
      type: "empresa",
      documents: [
        { id: "doc-1", name: "Contrato Social", uploaded: false },
        { id: "doc-2", name: "Cartão CNPJ", uploaded: false },
        { id: "doc-3", name: "Balanço Patrimonial", uploaded: false },
      ],
    },
    {
      id: "socio-pf-block",
      name: "Sócio PF",
      type: "socio_pf",
      people: [
        {
          id: "socio-pf-1",
          name: "Sócio PF 1",
          documents: [
            { id: "doc-4", name: "RG/CPF/CNH", uploaded: false },
            { id: "doc-5", name: "Comprovante de Residência", uploaded: false },
            { id: "doc-6", name: "Declaração de IR", uploaded: false },
          ],
          hasSpouse: false,
        },
      ],
    },
    {
      id: "socio-pj-block",
      name: "Sócio PJ",
      type: "socio_pj",
      people: [
        {
          id: "socio-pj-1",
          name: "Sócio PJ 1",
          documents: [
            { id: "doc-7", name: "Contrato Social", uploaded: false },
            { id: "doc-8", name: "Cartão CNPJ", uploaded: false },
            { id: "doc-9", name: "Balanço Patrimonial", uploaded: false },
          ],
        },
      ],
    },
    {
      id: "procurador-block",
      name: "Procurador",
      type: "procurador",
      people: [
        {
          id: "procurador-1",
          name: "Procurador 1",
          documents: [
            { id: "doc-10", name: "RG/CPF/CNH", uploaded: false },
            { id: "doc-11", name: "Procuração", uploaded: false },
            { id: "doc-12", name: "Comprovante de Residência", uploaded: false },
          ],
          hasSpouse: false,
        },
      ],
    },
  ]);

  const addPersonToBlock = (blockId: string, type: 'socio_pf' | 'socio_pj' | 'procurador') => {
    setEntities(entities.map(entity => {
      if (entity.id === blockId && entity.people) {
        const newCount = entity.people.length + 1;
        const newPerson: Person = {
          id: `${type}-${Date.now()}`,
          name: `${entity.name} ${newCount}`,
          documents: type === 'socio_pf' ? [
            { id: `doc-pf-${newCount}-1`, name: "RG/CPF/CNH", uploaded: false },
            { id: `doc-pf-${newCount}-2`, name: "Comprovante de Residência", uploaded: false },
            { id: `doc-pf-${newCount}-3`, name: "Declaração de IR", uploaded: false },
          ] : type === 'socio_pj' ? [
            { id: `doc-pj-${newCount}-1`, name: "Contrato Social", uploaded: false },
            { id: `doc-pj-${newCount}-2`, name: "Cartão CNPJ", uploaded: false },
            { id: `doc-pj-${newCount}-3`, name: "Balanço Patrimonial", uploaded: false },
          ] : [
            { id: `doc-proc-${newCount}-1`, name: "RG/CPF/CNH", uploaded: false },
            { id: `doc-proc-${newCount}-2`, name: "Procuração", uploaded: false },
            { id: `doc-proc-${newCount}-3`, name: "Comprovante de Residência", uploaded: false },
          ],
          hasSpouse: (type === 'socio_pf' || type === 'procurador') ? false : undefined,
        };
        return {
          ...entity,
          people: [...entity.people, newPerson],
        };
      }
      return entity;
    }));
  };

  const removePerson = (blockId: string, personId: string) => {
    setEntities(entities.map(entity => {
      if (entity.id === blockId && entity.people) {
        return {
          ...entity,
          people: entity.people.filter(p => p.id !== personId),
        };
      }
      return entity;
    }));
  };

  const addSpouse = (blockId: string, personId: string) => {
    setEntities(entities.map(entity => {
      if (entity.id === blockId && entity.people) {
        return {
          ...entity,
          people: entity.people.map(person => {
            if (person.id === personId) {
              return {
                ...person,
                hasSpouse: true,
                spouseDocuments: [
                  { id: `spouse-${personId}-1`, name: "RG/CPF/CNH", uploaded: false },
                  { id: `spouse-${personId}-2`, name: "Comprovante de Residência", uploaded: false },
                  { id: `spouse-${personId}-3`, name: "Certidão de Casamento", uploaded: false },
                ],
              };
            }
            return person;
          }),
        };
      }
      return entity;
    }));
  };

  const removeSpouse = (blockId: string, personId: string) => {
    setEntities(entities.map(entity => {
      if (entity.id === blockId && entity.people) {
        return {
          ...entity,
          people: entity.people.map(person => {
            if (person.id === personId) {
              return {
                ...person,
                hasSpouse: false,
                spouseDocuments: undefined,
              };
            }
            return person;
          }),
        };
      }
      return entity;
    }));
  };

  const getIcon = (type: EntityBlock['type']) => {
    switch (type) {
      case 'empresa':
        return <Building2 className="h-5 w-5" />;
      case 'socio_pf':
        return <User className="h-5 w-5" />;
      case 'socio_pj':
        return <Building2 className="h-5 w-5" />;
      case 'procurador':
        return <Briefcase className="h-5 w-5" />;
    }
  };

  const canHaveSpouse = (type: EntityBlock['type']) => {
    return type === 'socio_pf' || type === 'procurador';
  };

  const calculateProgress = (entity: EntityBlock) => {
    let total = 0;
    let uploaded = 0;

    // Documentos da empresa
    if (entity.documents) {
      entity.documents.forEach(doc => {
        total++;
        if (doc.uploaded) uploaded++;
      });
    }

    // Documentos das pessoas
    if (entity.people) {
      entity.people.forEach(person => {
        person.documents.forEach(doc => {
          total++;
          if (doc.uploaded) uploaded++;
        });
        
        // Documentos do cônjuge
        if (person.spouseDocuments) {
          person.spouseDocuments.forEach(doc => {
            total++;
            if (doc.uploaded) uploaded++;
          });
        }
      });
    }

    return { uploaded, total };
  };

  const generateFormSteps = () => {
    const steps: FormStep[] = [{ type: 'documents' }];
    
    entities.forEach(entity => {
      if (entity.type === 'empresa') {
        steps.push({ type: 'empresa', entityId: entity.id });
      } else if (entity.people) {
        entity.people.forEach(person => {
          if (entity.type === 'socio_pf') {
            steps.push({
              type: 'socio_pf',
              entityId: entity.id,
              personId: person.id,
              personName: person.name,
              hasSpouse: person.hasSpouse,
            });
          } else if (entity.type === 'socio_pj') {
            steps.push({
              type: 'socio_pj',
              entityId: entity.id,
              personId: person.id,
              personName: person.name,
            });
          } else if (entity.type === 'procurador') {
            steps.push({
              type: 'procurador',
              entityId: entity.id,
              personId: person.id,
              personName: person.name,
              hasSpouse: person.hasSpouse,
            });
          }
        });
      }
    });
    
    setFormSteps(steps);
  };

  const handleContinue = () => {
    if (currentStepIndex === 0) {
      // Da etapa de documentos para os formulários
      generateFormSteps();
      setCurrentStepIndex(1);
    } else if (currentStepIndex < formSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      // Finalizar cadastro
      toast({
        title: "Cadastro finalizado!",
        description: "Todos os dados foram enviados com sucesso.",
      });
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleFormSubmit = (data: any) => {
    console.log("Form data:", data);
    handleContinue();
  };

  const currentStep = formSteps[currentStepIndex];

  if (currentStep?.type === 'empresa') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dados da Empresa</h1>
          <p className="text-muted-foreground mt-2">
            Preencha as informações da empresa
          </p>
        </div>
        <EmpresaForm onSubmit={handleFormSubmit} onBack={handleBack} />
      </div>
    );
  }

  if (currentStep?.type === 'socio_pf') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dados do Sócio PF</h1>
          <p className="text-muted-foreground mt-2">
            Preencha as informações do sócio pessoa física
          </p>
        </div>
        <SocioPFForm
          personName={currentStep.personName || "Sócio PF"}
          hasSpouse={currentStep.hasSpouse || false}
          onSubmit={handleFormSubmit}
          onBack={handleBack}
        />
      </div>
    );
  }

  if (currentStep?.type === 'socio_pj') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dados do Sócio PJ</h1>
          <p className="text-muted-foreground mt-2">
            Preencha as informações do sócio pessoa jurídica
          </p>
        </div>
        <SocioPJForm
          personName={currentStep.personName || "Sócio PJ"}
          onSubmit={handleFormSubmit}
          onBack={handleBack}
        />
      </div>
    );
  }

  if (currentStep?.type === 'procurador') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dados do Procurador</h1>
          <p className="text-muted-foreground mt-2">
            Preencha as informações do procurador
          </p>
        </div>
        <ProcuradorForm
          personName={currentStep.personName || "Procurador"}
          hasSpouse={currentStep.hasSpouse || false}
          onSubmit={handleFormSubmit}
          onBack={handleBack}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Recrutamento</h1>
        <p className="text-muted-foreground mt-2">
          Organize e envie a documentação necessária para cadastro
        </p>
      </div>

      {/* Blocos de Documentação */}
      <div className="space-y-4">
        {entities.map((entity) => (
          <Card key={entity.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getIcon(entity.type)}
                  <CardTitle className="text-lg">{entity.name}</CardTitle>
                </div>
                <div className="flex items-center gap-3 min-w-[120px]">
                  <div className="flex flex-col gap-1 flex-1">
                    <div className="text-xs text-muted-foreground text-right">
                      {calculateProgress(entity).uploaded}/{calculateProgress(entity).total}
                    </div>
                    <Progress 
                      value={calculateProgress(entity).total > 0 
                        ? (calculateProgress(entity).uploaded / calculateProgress(entity).total) * 100 
                        : 0
                      } 
                      className="h-2"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Documentos da Empresa */}
              {entity.type === 'empresa' && entity.documents && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {entity.documents.map((doc) => (
                    <Card key={doc.id} className="border-dashed">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{doc.name}</h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              {doc.uploaded ? "Documento enviado" : "Nenhum documento enviado"}
                            </p>
                          </div>
                          <Button variant="ghost" size="icon">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Pessoas (Sócios/Procuradores) */}
              {entity.people && entity.people.map((person, index) => (
                <div key={person.id} className="space-y-4">
                  {index > 0 && <div className="border-t pt-4" />}
                  
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{person.name}</h3>
                    <div className="flex items-center gap-2">
                      {canHaveSpouse(entity.type) && !person.hasSpouse && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addSpouse(entity.id, person.id)}
                        >
                          <Users className="h-4 w-4 mr-2" />
                          Adicionar Cônjuge
                        </Button>
                      )}
                      {entity.people && entity.people.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removePerson(entity.id, person.id)}
                        >
                          Remover
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Documentos da Pessoa */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {person.documents.map((doc) => (
                      <Card key={doc.id} className="border-dashed">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">{doc.name}</h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                {doc.uploaded ? "Documento enviado" : "Nenhum documento enviado"}
                              </p>
                            </div>
                            <Button variant="ghost" size="icon">
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Documentos do Cônjuge */}
                  {person.hasSpouse && person.spouseDocuments && (
                    <Collapsible defaultOpen>
                      <div className="border-t pt-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <CollapsibleTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Users className="h-4 w-4 mr-2" />
                              Documentos do Cônjuge
                            </Button>
                          </CollapsibleTrigger>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSpouse(entity.id, person.id)}
                          >
                            Remover Cônjuge
                          </Button>
                        </div>
                        <CollapsibleContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                            {person.spouseDocuments.map((doc) => (
                              <Card key={doc.id} className="border-dashed">
                                <CardContent className="p-4">
                                  <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                      <h4 className="font-medium text-sm">{doc.name}</h4>
                                      <p className="text-xs text-muted-foreground mt-1">
                                        {doc.uploaded ? "Documento enviado" : "Nenhum documento enviado"}
                                      </p>
                                    </div>
                                    <Button variant="ghost" size="icon">
                                      <Plus className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </CollapsibleContent>
                      </div>
                    </Collapsible>
                  )}
                </div>
              ))}

              {/* Botão para adicionar mais pessoas ao bloco */}
              {entity.type !== 'empresa' && (
                <Button
                  variant="outline"
                  onClick={() => addPersonToBlock(entity.id, entity.type as 'socio_pf' | 'socio_pj' | 'procurador')}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar {entity.name}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Botão Continuar */}
      <div className="flex justify-end">
        <Button size="lg" className="px-8" onClick={handleContinue}>
          Continuar
        </Button>
      </div>
    </div>
  );
}
