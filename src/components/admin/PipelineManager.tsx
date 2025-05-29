"use client";

import { useState, useEffect } from 'react';
import type { Pipeline, PipelineStage } from '@/types';
import { getPipelines, addPipeline, updatePipeline } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Trash2, Save, Edit2, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from '../ui/label';
import { ScrollArea } from '../ui/scroll-area';

export function PipelineManager() {
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPipeline, setCurrentPipeline] = useState<Partial<Pipeline> & { stages: Array<Partial<PipelineStage> & { tempId?: string }> }>({ name: '', stages: [{ name: '', tempId: `new-${Date.now()}` }]});
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchPipelinesData() {
      setLoading(true);
      const fetchedPipelines = await getPipelines();
      setPipelines(fetchedPipelines);
      setLoading(false);
    }
    fetchPipelinesData();
  }, []);

  const handleOpenDialog = (pipeline?: Pipeline) => {
    if (pipeline) {
      setCurrentPipeline({ ...pipeline, stages: pipeline.stages.map(s => ({...s})) }); // Deep copy stages
      setIsEditing(true);
    } else {
      setCurrentPipeline({ name: '', stages: [{ name: '', tempId: `new-${Date.now()}` }]});
      setIsEditing(false);
    }
    setIsDialogOpen(true);
  };

  const handlePipelineNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPipeline(prev => ({ ...prev, name: e.target.value }));
  };

  const handleStageNameChange = (index: number, value: string) => {
    const newStages = [...currentPipeline.stages];
    newStages[index] = { ...newStages[index], name: value };
    setCurrentPipeline(prev => ({ ...prev, stages: newStages }));
  };

  const addStageField = () => {
    setCurrentPipeline(prev => ({
      ...prev,
      stages: [...(prev.stages || []), { name: '', tempId: `new-${Date.now()}` }],
    }));
  };

  const removeStageField = (index: number) => {
    if (currentPipeline.stages.length <= 1) {
        toast({ title: "Cannot remove", description: "A pipeline must have at least one stage.", variant: "destructive" });
        return;
    }
    const newStages = currentPipeline.stages.filter((_, i) => i !== index);
    setCurrentPipeline(prev => ({ ...prev, stages: newStages }));
  };

  const handleSubmitPipeline = async () => {
    if (!currentPipeline.name?.trim()) {
      toast({ title: "Error", description: "Pipeline name is required.", variant: "destructive" });
      return;
    }
    if (!currentPipeline.stages || currentPipeline.stages.some(s => !s.name?.trim())) {
      toast({ title: "Error", description: "All stage names are required.", variant: "destructive" });
      return;
    }

    const finalStages: PipelineStage[] = currentPipeline.stages.map((s, idx) => ({
        id: s.id || `stage-${Date.now()}-${idx}`, // Generate new ID if not present
        name: s.name!,
        order: idx + 1,
    }));

    const pipelineData: Pipeline = {
        id: currentPipeline.id || `pipeline-${Date.now()}`,
        name: currentPipeline.name,
        stages: finalStages,
    };
    
    try {
      let savedPipeline;
      if (isEditing) {
        savedPipeline = await updatePipeline(pipelineData);
        if (savedPipeline) {
            setPipelines(prev => prev.map(p => p.id === savedPipeline!.id ? savedPipeline! : p));
        }
      } else {
        savedPipeline = await addPipeline(pipelineData);
        if (savedPipeline) {
            setPipelines(prev => [...prev, savedPipeline!]);
        }
      }

      if (savedPipeline) {
        toast({ title: `Pipeline ${isEditing ? 'Updated' : 'Created'}`, description: `Pipeline "${savedPipeline.name}" has been saved.` });
        setIsDialogOpen(false);
      } else {
         throw new Error("Failed to save pipeline.");
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to save pipeline.", variant: "destructive" });
    }
  };


  if (loading) return <p>Loading pipelines...</p>;

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-2xl font-bold flex items-center"><Settings className="mr-2 h-6 w-6 text-primary" /> Manage Pipelines</CardTitle>
          <CardDescription>Define and customize hiring stages for your job postings.</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <PlusCircle className="mr-2 h-4 w-4" /> Create New Pipeline
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit Pipeline' : 'Create New Pipeline'}</DialogTitle>
              <DialogDescription>
                Define the name and stages for this pipeline. Stages will appear in order.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="pipelineName" className="text-right">Name</Label>
                <Input id="pipelineName" value={currentPipeline.name || ''} onChange={handlePipelineNameChange} className="col-span-3" placeholder="e.g., Standard Tech Hiring"/>
              </div>
              <Label className="font-medium">Stages</Label>
              <ScrollArea className="h-[200px] border rounded-md p-2">
                <div className="space-y-2">
                {currentPipeline.stages?.map((stage, index) => (
                    <div key={stage.id || stage.tempId} className="flex items-center space-x-2">
                    <Input
                        value={stage.name || ''}
                        onChange={(e) => handleStageNameChange(index, e.target.value)}
                        placeholder={`Stage ${index + 1} Name`}
                        className="flex-grow"
                    />
                    <Button type="button" variant="destructive" size="icon" onClick={() => removeStageField(index)} disabled={(currentPipeline.stages?.length || 0) <= 1}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                    </div>
                ))}
                </div>
              </ScrollArea>
              <Button type="button" variant="outline" onClick={addStageField} size="sm">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Stage
              </Button>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
              <Button onClick={handleSubmitPipeline}><Save className="mr-2 h-4 w-4" /> Save Pipeline</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {pipelines.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No pipelines configured yet.</p>
        ) : (
          <div className="space-y-4">
            {pipelines.map(pipeline => (
              <Card key={pipeline.id} className="bg-muted/30">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">{pipeline.name}</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(pipeline)}>
                        <Edit2 className="mr-2 h-4 w-4" /> Edit
                    </Button>
                </CardHeader>
                <CardContent>
                  <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
                    {pipeline.stages.sort((a,b) => a.order - b.order).map(stage => (
                      <li key={stage.id}>{stage.name}</li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
