"use client"

import { useForm } from "react-hook-form"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Textarea } from "@/components/ui/textarea"
import { Save } from "lucide-react"

type AiIntegrationSettingsFormValues = {
  voiceToTextProvider: string
  spamSensitivity: number[]
  togglePriorityDetectionAi: boolean
  editableRules: string
}

export function AiIntegrationSettings() {
  const { register, handleSubmit, watch, setValue } =
    useForm<AiIntegrationSettingsFormValues>({
      defaultValues: {
        voiceToTextProvider: "Whisper",
        spamSensitivity: [50],
        togglePriorityDetectionAi: true,
        editableRules:
          "Rule 1: Block known spam patterns.\nRule 2: Flag messages with excessive emojis.\nRule 3: Prioritize messages from VIP users.",
      },
    })

  const onSubmit = (data: AiIntegrationSettingsFormValues) => {
    console.log("AI Integration Settings Saved:", data)
    alert("AI Integration settings saved!")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Integration Settings</CardTitle>
        <CardDescription>
          Configure artificial intelligence features and their behavior.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="voiceToTextProvider">Voice-to-Text Provider</Label>
            <Select
              onValueChange={(value) => setValue("voiceToTextProvider", value)}
              defaultValue={watch("voiceToTextProvider")}
            >
              <SelectTrigger id="voiceToTextProvider">
                <SelectValue placeholder="Select a provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Whisper">Whisper</SelectItem>
                <SelectItem value="Google STT">Google STT</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <Label htmlFor="spamSensitivity">Spam Sensitivity</Label>
            <Slider
              id="spamSensitivity"
              defaultValue={watch("spamSensitivity")}
              max={100}
              step={1}
              onValueChange={(value) => setValue("spamSensitivity", value)}
            />
            <div className="text-sm text-gray-500">
              Current Sensitivity: {watch("spamSensitivity")[0]}%
            </div>
          </div>

          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="togglePriorityDetectionAi">
              Toggle Priority Detection AI
            </Label>
            <Switch
              id="togglePriorityDetectionAi"
              checked={watch("togglePriorityDetectionAi")}
              onCheckedChange={(checked) =>
                setValue("togglePriorityDetectionAi", checked)
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Editable Rules</Label>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>View/Edit AI Rules</AccordionTrigger>
                <AccordionContent>
                  <Textarea
                    id="editableRules"
                    rows={8}
                    placeholder="Enter AI rules, one per line..."
                    {...register("editableRules")}
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Define rules for AI behavior, e.g., spam filtering or
                    content moderation.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <Button
            type="submit"
            className="text-white bg-slate-800 hover:bg-slate-900"
          >
            <Save className="w-4 h-4 mr-2" /> Save Changes
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
