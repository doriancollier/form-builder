import React, { useMemo, useState, useRef } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import { Form, FormField, FormItem, FormControl } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { renderFormField } from '@/screens/render-form-field'
import {
  generateZodSchema,
  generateDefaultValues,
} from '@/screens/generate-code-parts'
import { FormFieldType } from '@/types'

// Convert the JSON form field type to FormFieldType
const convertJsonFieldToFormField = (jsonField: any): FormFieldType => {
  // Map common input types to their proper variants
  const typeToVariant: { [key: string]: string } = {
    text: 'Input',
    email: 'Input',
    textarea: 'Textarea',
    password: 'Password',
    checkbox: 'Checkbox',
    select: 'Select',
    file: 'File Input',
    date: 'Date Picker',
    datetime: 'Datetime Picker',
    phone: 'Phone',
  }

  return {
    variant:
      typeToVariant[jsonField.type] ||
      jsonField.type.charAt(0).toUpperCase() + jsonField.type.slice(1),
    type: jsonField.type || '',
    label: jsonField.label,
    name: jsonField.name,
    placeholder: jsonField.placeholder,
    required: jsonField.required,
    description: jsonField.description,
    options: jsonField.options,
    disabled: jsonField.disabled || false,
    value: jsonField.value || '',
    setValue: () => {},
    checked: jsonField.checked || false,
    onChange: () => {},
    onSelect: () => {},
    rowIndex: 0,
  }
}

interface FormRendererProps {
  formData: {
    fields: any[]
  }
}

const FormRenderer: React.FC<FormRendererProps> = ({ formData }) => {
  const formFields = useMemo(
    () => formData.fields.map(convertJsonFieldToFormField),
    [formData.fields],
  )

  const formSchema = useMemo(() => generateZodSchema(formFields), [formFields])
  const defaultVals = useMemo(
    () => generateDefaultValues(formFields),
    [formFields],
  )

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultVals,
  })

  const [checked, setChecked] = useState(false)
  const [smartDatetime, setSmartDatetime] = useState<Date>()
  const [tagsValue, setTagsValue] = useState<string[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [value, setValue] = useState('')
  const [date, setDate] = useState<Date>()
  const [selectedValues, setSelectedValues] = useState<string[]>([])
  const [countryName, setCountryName] = useState('')
  const [stateName, setStateName] = useState('')
  const [files, setFiles] = useState<File[] | null>(null)
  const [datetime, setDatetime] = useState<Date>()

  const renderedFields = formFields.map((field, index) => {
    const renderedField = renderFormField(field, form, {
      checked,
      setChecked,
      smartDatetime,
      setSmartDatetime,
      tagsValue,
      setTagsValue,
      canvasRef,
      value,
      setValue,
      date,
      setDate,
      selectedValues,
      setSelectedValues,
      countryName,
      setCountryName,
      stateName,
      setStateName,
      files,
      setFiles,
      datetime,
      setDatetime,
    })

    if (!renderedField) {
      return null
    }

    return (
      <FormField
        key={field.name || index}
        control={form.control}
        name={field.name}
        render={({ field: formField }) => (
          <FormItem>
            <FormControl>
              {React.cloneElement(renderedField as React.ReactElement, {
                ...formField,
              })}
            </FormControl>
          </FormItem>
        )}
      />
    )
  })

  function onSubmit(data: any) {
    try {
      toast(
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>,
      )
    } catch (error) {
      console.error('Form submission error', error)
      toast.error('Failed to submit the form. Please try again.')
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 py-5 max-w-lg mx-auto"
      >
        {renderedFields}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}

export default FormRenderer
