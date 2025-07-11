'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Icons } from '@/components/icons'
import { MainLayout } from '@/components/layout/MainLayout'
import { generateSingleQuestion } from '@/ai/flows/generate-single-question'
import { generateAndSaveRosco } from '@/ai/flows/generate-full-roscos'
import { saveQuestion } from './_actions/saveQuestion'
import { saveCsv } from './_actions/saveCsv'
import { useToast } from '@/hooks/use-toast'

export default function GeneratorPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // Single Question Form
  const [questionForm, setQuestionForm] = useState({
    letter: '',
    category: '',
    difficulty: 'medium' as const,
  })
  const [generatedQuestion, setGeneratedQuestion] = useState<any>(null)

  // Rosco Generation Form
  const [roscoForm, setRoscoForm] = useState({
    name: '',
    difficulty: 'medium' as const,
    categories: [] as string[],
  })

  // CSV Import Form
  const [csvForm, setCsvForm] = useState({
    name: '',
    difficulty: 'medium' as const,
    content: '',
  })

  const categories = [
    'Animales', 'Deportes', 'Geografía', 'Historia', 'Ciencia',
    'Arte', 'Música', 'Literatura', 'Cine', 'Tecnología',
    'Comida', 'Naturaleza', 'Medicina', 'Arquitectura', 'Filosofía'
  ]

  const handleGenerateQuestion = async () => {
    if (!questionForm.letter) {
      toast({
        title: "Error",
        description: "Por favor, introduce una letra",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const result = await generateSingleQuestion({
        letter: questionForm.letter,
        category: questionForm.category || undefined,
        difficulty: questionForm.difficulty,
      })

      if (result.success) {
        setGeneratedQuestion(result.data)
        toast({
          title: "¡Éxito!",
          description: "Pregunta generada correctamente",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Error generando pregunta",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error inesperado generando pregunta",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveQuestion = async () => {
    if (!generatedQuestion) return

    setIsLoading(true)
    try {
      const result = await saveQuestion({
        letter: generatedQuestion.letter,
        definition: generatedQuestion.definition,
        answer: generatedQuestion.answer,
        category: generatedQuestion.category,
        difficulty: questionForm.difficulty,
      })

      if (result.success) {
        toast({
          title: "¡Éxito!",
          description: "Pregunta guardada en la base de datos",
        })
        setGeneratedQuestion(null)
        setQuestionForm({ letter: '', category: '', difficulty: 'medium' })
      } else {
        toast({
          title: "Error",
          description: result.error || "Error guardando pregunta",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error inesperado guardando pregunta",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateRosco = async () => {
    if (!roscoForm.name) {
      toast({
        title: "Error",
        description: "Por favor, introduce un nombre para el rosco",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const result = await generateAndSaveRosco({
        name: roscoForm.name,
        difficulty: roscoForm.difficulty,
        categories: roscoForm.categories.length > 0 ? roscoForm.categories : undefined,
      })

      if (result.success) {
        toast({
          title: "¡Éxito!",
          description: "Rosco generado y guardado correctamente",
        })
        setRoscoForm({ name: '', difficulty: 'medium', categories: [] })
      } else {
        toast({
          title: "Error",
          description: result.error || "Error generando rosco",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error inesperado generando rosco",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleImportCsv = async () => {
    if (!csvForm.name || !csvForm.content) {
      toast({
        title: "Error",
        description: "Por favor, completa todos los campos",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const result = await saveCsv(csvForm.content, csvForm.name, csvForm.difficulty)

      if (result.success) {
        toast({
          title: "¡Éxito!",
          description: "CSV importado correctamente",
        })
        setCsvForm({ name: '', difficulty: 'medium', content: '' })
      } else {
        toast({
          title: "Error",
          description: result.error || "Error importando CSV",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error inesperado importando CSV",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Generador de Contenido</h1>
          <p className="text-muted-foreground">
            Crea preguntas y roscos usando inteligencia artificial
          </p>
        </div>

        <Tabs defaultValue="question" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="question">Pregunta Individual</TabsTrigger>
            <TabsTrigger value="rosco">Rosco Completo</TabsTrigger>
            <TabsTrigger value="csv">Importar CSV</TabsTrigger>
          </TabsList>

          {/* Single Question Tab */}
          <TabsContent value="question">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Generar Pregunta</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="letter">Letra</Label>
                    <Input
                      id="letter"
                      value={questionForm.letter}
                      onChange={(e) => setQuestionForm(prev => ({ 
                        ...prev, 
                        letter: e.target.value.toUpperCase().slice(0, 1) 
                      }))}
                      placeholder="A"
                      maxLength={1}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Categoría (opcional)</Label>
                    <Select 
                      value={questionForm.category} 
                      onValueChange={(value) => setQuestionForm(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Dificultad</Label>
                    <Select 
                      value={questionForm.difficulty} 
                      onValueChange={(value: any) => setQuestionForm(prev => ({ ...prev, difficulty: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Fácil</SelectItem>
                        <SelectItem value="medium">Medio</SelectItem>
                        <SelectItem value="hard">Difícil</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    onClick={handleGenerateQuestion} 
                    disabled={isLoading || !questionForm.letter}
                    className="w-full"
                  >
                    {isLoading ? (
                      <>
                        <Icons.zap className="w-4 h-4 mr-2 animate-spin" />
                        Generando...
                      </>
                    ) : (
                      <>
                        <Icons.zap className="w-4 h-4 mr-2" />
                        Generar Pregunta
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {generatedQuestion && (
                <Card>
                  <CardHeader>
                    <CardTitle>Pregunta Generada</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Letra</Label>
                      <div className="text-2xl font-bold text-primary">
                        {generatedQuestion.letter}
                      </div>
                    </div>

                    <div>
                      <Label>Definición</Label>
                      <p className="text-sm bg-muted p-3 rounded">
                        {generatedQuestion.definition}
                      </p>
                    </div>

                    <div>
                      <Label>Respuesta</Label>
                      <div className="font-semibold text-green-600">
                        {generatedQuestion.answer}
                      </div>
                    </div>

                    {generatedQuestion.category && (
                      <div>
                        <Label>Categoría</Label>
                        <Badge variant="outline">{generatedQuestion.category}</Badge>
                      </div>
                    )}

                    <Button onClick={handleSaveQuestion} disabled={isLoading} className="w-full">
                      {isLoading ? (
                        <>
                          <Icons.zap className="w-4 h-4 mr-2 animate-spin" />
                          Guardando...
                        </>
                      ) : (
                        <>
                          <Icons.target className="w-4 h-4 mr-2" />
                          Guardar Pregunta
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Full Rosco Tab */}
          <TabsContent value="rosco">
            <Card>
              <CardHeader>
                <CardTitle>Generar Rosco Completo</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Genera un rosco completo con 26 preguntas (A-Z) usando IA
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="rosco-name">Nombre del Rosco</Label>
                  <Input
                    id="rosco-name"
                    value={roscoForm.name}
                    onChange={(e) => setRoscoForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ej: Rosco de Cultura General"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rosco-difficulty">Dificultad</Label>
                  <Select 
                    value={roscoForm.difficulty} 
                    onValueChange={(value: any) => setRoscoForm(prev => ({ ...prev, difficulty: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Fácil</SelectItem>
                      <SelectItem value="medium">Medio</SelectItem>
                      <SelectItem value="hard">Difícil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Categorías Preferidas (opcional)</Label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <Badge
                        key={category}
                        variant={roscoForm.categories.includes(category) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => {
                          setRoscoForm(prev => ({
                            ...prev,
                            categories: prev.categories.includes(category)
                              ? prev.categories.filter(c => c !== category)
                              : [...prev.categories, category]
                          }))
                        }}
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={handleGenerateRosco} 
                  disabled={isLoading || !roscoForm.name}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Icons.zap className="w-4 h-4 mr-2 animate-spin" />
                      Generando Rosco...
                    </>
                  ) : (
                    <>
                      <Icons.crown className="w-4 h-4 mr-2" />
                      Generar Rosco Completo
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* CSV Import Tab */}
          <TabsContent value="csv">
            <Card>
              <CardHeader>
                <CardTitle>Importar desde CSV</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Formato: letra,definición,respuesta,categoría (opcional)
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="csv-name">Nombre del Rosco</Label>
                  <Input
                    id="csv-name"
                    value={csvForm.name}
                    onChange={(e) => setCsvForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ej: Rosco Importado"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="csv-difficulty">Dificultad</Label>
                  <Select 
                    value={csvForm.difficulty} 
                    onValueChange={(value: any) => setCsvForm(prev => ({ ...prev, difficulty: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Fácil</SelectItem>
                      <SelectItem value="medium">Medio</SelectItem>
                      <SelectItem value="hard">Difícil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="csv-content">Contenido CSV</Label>
                  <Textarea
                    id="csv-content"
                    value={csvForm.content}
                    onChange={(e) => setCsvForm(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="A,Animal marino de gran tamaño,atun,Animales&#10;B,Deporte con pelota naranja,baloncesto,Deportes"
                    rows={10}
                  />
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Formato esperado:</h4>
                  <code className="text-sm">
                    A,Animal marino de gran tamaño,atun,Animales<br />
                    B,Deporte con pelota naranja,baloncesto,Deportes<br />
                    C,Capital de España,madrid,Geografía
                  </code>
                </div>

                <Button 
                  onClick={handleImportCsv} 
                  disabled={isLoading || !csvForm.name || !csvForm.content}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Icons.zap className="w-4 h-4 mr-2 animate-spin" />
                      Importando...
                    </>
                  ) : (
                    <>
                      <Icons.target className="w-4 h-4 mr-2" />
                      Importar CSV
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}