import React from 'react'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import dynamic from 'next/dynamic'
import FormRenderer from './form-renderer'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

// Dynamically import CodeMirror to avoid SSR issues
const CodeMirror = dynamic(
  () => import('@uiw/react-codemirror').then((mod) => mod.default),
  { ssr: false },
)

const defaultFormJson = {
  fields: [
    {
      type: 'text',
      label: 'Full Name',
      placeholder: 'Enter your name',
      required: true,
      name: 'fullName',
    },
    {
      type: 'email',
      label: 'Email',
      placeholder: 'Enter your email',
      required: true,
      name: 'email',
    },
    {
      type: 'textarea',
      label: 'Bio',
      name: 'bio',
      placeholder: 'Tell us about yourself',
      rows: 4,
      maxLength: 500,
      description: 'Maximum 500 characters',
    },
  ],
}

// Add field type documentation
const fieldTypesDocs = {
  input: {
    description:
      'Standard input field with multiple variants (text, email, number)',
    properties: {
      type: 'input',
      variant: 'string - One of: text, email, number, tel, url, search',
      label: 'string - The label shown above the input',
      name: 'string - Unique identifier for the field',
      placeholder: 'string (optional) - Placeholder text',
      required: 'boolean (optional) - Whether the field is required',
      disabled: 'boolean (optional) - Whether the field is disabled',
      description: 'string (optional) - Helper text shown below the input',
    },
    example: {
      type: 'input',
      variant: 'email',
      label: 'Email Address',
      name: 'email',
      placeholder: 'Enter your email',
      required: true,
      description: 'We will never share your email',
    },
  },

  checkbox: {
    description: 'Single checkbox input for boolean values',
    properties: {
      type: 'checkbox',
      label: 'string - The label shown next to the checkbox',
      name: 'string - Unique identifier for the field',
      checked: 'boolean - Default checked state',
      required: 'boolean (optional) - Whether the field is required',
      disabled: 'boolean (optional) - Whether the field is disabled',
      description: 'string (optional) - Helper text shown below the checkbox',
    },
    example: {
      type: 'checkbox',
      label: 'Subscribe to newsletter',
      name: 'newsletter',
      checked: false,
      description: 'Receive updates about our products',
    },
  },

  'date-picker': {
    description: 'Calendar input for selecting dates',
    properties: {
      type: 'date-picker',
      label: 'string - The label shown above the input',
      name: 'string - Unique identifier for the field',
      required: 'boolean (optional) - Whether the field is required',
      disabled: 'boolean (optional) - Whether the field is disabled',
      min: 'string (optional) - Minimum selectable date (YYYY-MM-DD)',
      max: 'string (optional) - Maximum selectable date (YYYY-MM-DD)',
      description: 'string (optional) - Helper text shown below the input',
    },
    example: {
      type: 'date-picker',
      label: 'Appointment Date',
      name: 'appointmentDate',
      required: true,
      min: '2024-03-01',
      max: '2024-12-31',
      description: 'Select your preferred appointment date',
    },
  },

  'datetime-picker': {
    description: 'Calendar and time input for selecting date and time',
    properties: {
      type: 'datetime-picker',
      label: 'string - The label shown above the input',
      name: 'string - Unique identifier for the field',
      required: 'boolean (optional) - Whether the field is required',
      disabled: 'boolean (optional) - Whether the field is disabled',
      min: 'string (optional) - Minimum selectable datetime',
      max: 'string (optional) - Maximum selectable datetime',
      description: 'string (optional) - Helper text shown below the input',
    },
    example: {
      type: 'datetime-picker',
      label: 'Meeting Time',
      name: 'meetingTime',
      required: true,
      description: 'Select the date and time for your meeting',
    },
  },

  'file-input': {
    description: 'File upload input with drag and drop support',
    properties: {
      type: 'file-input',
      label: 'string - The label shown above the input',
      name: 'string - Unique identifier for the field',
      accept: 'string (optional) - Allowed file types (e.g., "image/*")',
      multiple: 'boolean (optional) - Allow multiple file selection',
      maxSize: 'number (optional) - Maximum file size in bytes',
      required: 'boolean (optional) - Whether the field is required',
      disabled: 'boolean (optional) - Whether the field is disabled',
      description: 'string (optional) - Helper text shown below the input',
    },
    example: {
      type: 'file-input',
      label: 'Upload Documents',
      name: 'documents',
      accept: '.pdf,.doc,.docx',
      multiple: true,
      maxSize: 5242880, // 5MB
      description: 'Upload your supporting documents (PDF, DOC, DOCX)',
    },
  },

  password: {
    description: 'Password input with show/hide toggle',
    properties: {
      type: 'password',
      label: 'string - The label shown above the input',
      name: 'string - Unique identifier for the field',
      placeholder: 'string (optional) - Placeholder text',
      required: 'boolean (optional) - Whether the field is required',
      disabled: 'boolean (optional) - Whether the field is disabled',
      description: 'string (optional) - Helper text shown below the input',
    },
    example: {
      type: 'password',
      label: 'Password',
      name: 'password',
      placeholder: 'Enter your password',
      required: true,
      description: 'Must be at least 8 characters long',
    },
  },

  phone: {
    description: 'Phone number input with country code selection',
    properties: {
      type: 'phone',
      label: 'string - The label shown above the input',
      name: 'string - Unique identifier for the field',
      placeholder: 'string (optional) - Placeholder text',
      required: 'boolean (optional) - Whether the field is required',
      disabled: 'boolean (optional) - Whether the field is disabled',
      defaultCountry: 'string (optional) - Default country code (e.g., "US")',
      description: 'string (optional) - Helper text shown below the input',
    },
    example: {
      type: 'phone',
      label: 'Phone Number',
      name: 'phoneNumber',
      placeholder: 'Enter your phone number',
      defaultCountry: 'US',
      required: true,
    },
  },

  select: {
    description: 'Dropdown select input with single selection',
    properties: {
      type: 'select',
      label: 'string - The label shown above the select',
      name: 'string - Unique identifier for the field',
      placeholder: 'string (optional) - Placeholder text',
      options: 'array - Array of {label: string, value: string} objects',
      required: 'boolean (optional) - Whether the field is required',
      disabled: 'boolean (optional) - Whether the field is disabled',
      description: 'string (optional) - Helper text shown below the select',
    },
    example: {
      type: 'select',
      label: 'Country',
      name: 'country',
      placeholder: 'Select your country',
      options: [
        { label: 'United States', value: 'US' },
        { label: 'United Kingdom', value: 'UK' },
        { label: 'Canada', value: 'CA' },
      ],
      required: true,
    },
  },

  'multi-select': {
    description: 'Dropdown select input with multiple selection support',
    properties: {
      type: 'multi-select',
      label: 'string - The label shown above the select',
      name: 'string - Unique identifier for the field',
      placeholder: 'string (optional) - Placeholder text',
      options: 'array - Array of {label: string, value: string} objects',
      required: 'boolean (optional) - Whether the field is required',
      disabled: 'boolean (optional) - Whether the field is disabled',
      maxItems:
        'number (optional) - Maximum number of items that can be selected',
      description: 'string (optional) - Helper text shown below the select',
    },
    example: {
      type: 'multi-select',
      label: 'Skills',
      name: 'skills',
      placeholder: 'Select your skills',
      options: [
        { label: 'React', value: 'react' },
        { label: 'TypeScript', value: 'typescript' },
        { label: 'Node.js', value: 'nodejs' },
      ],
      maxItems: 5,
      required: true,
    },
  },

  'signature-input': {
    description: 'Canvas-based signature pad for capturing signatures',
    properties: {
      type: 'signature-input',
      label: 'string - The label shown above the signature pad',
      name: 'string - Unique identifier for the field',
      required: 'boolean (optional) - Whether the field is required',
      disabled: 'boolean (optional) - Whether the field is disabled',
      width: 'number (optional) - Width of the signature pad',
      height: 'number (optional) - Height of the signature pad',
      description:
        'string (optional) - Helper text shown below the signature pad',
    },
    example: {
      type: 'signature-input',
      label: 'Signature',
      name: 'signature',
      width: 400,
      height: 200,
      required: true,
      description: 'Please sign using your mouse or touch screen',
    },
  },

  slider: {
    description: 'Range slider input for selecting numeric values',
    properties: {
      type: 'slider',
      label: 'string - The label shown above the slider',
      name: 'string - Unique identifier for the field',
      min: 'number - Minimum value',
      max: 'number - Maximum value',
      step: 'number - Step increment',
      defaultValue: 'number (optional) - Default value',
      required: 'boolean (optional) - Whether the field is required',
      disabled: 'boolean (optional) - Whether the field is disabled',
      description: 'string (optional) - Helper text shown below the slider',
    },
    example: {
      type: 'slider',
      label: 'Price Range',
      name: 'priceRange',
      min: 0,
      max: 1000,
      step: 10,
      defaultValue: 500,
      description: 'Drag to select your price range',
    },
  },

  'smart-datetime': {
    description: 'Advanced datetime picker with natural language processing',
    properties: {
      type: 'smart-datetime',
      label: 'string - The label shown above the input',
      name: 'string - Unique identifier for the field',
      placeholder: 'string (optional) - Placeholder text',
      required: 'boolean (optional) - Whether the field is required',
      disabled: 'boolean (optional) - Whether the field is disabled',
      description: 'string (optional) - Helper text shown below the input',
    },
    example: {
      type: 'smart-datetime',
      label: 'Event Time',
      name: 'eventTime',
      placeholder: 'Type "next monday at 3pm" or select from calendar',
      required: true,
      description: 'Enter date/time in natural language or use the picker',
    },
  },

  switch: {
    description: 'Toggle switch input for boolean values with a modern look',
    properties: {
      type: 'switch',
      label: 'string - The label shown next to the switch',
      name: 'string - Unique identifier for the field',
      checked: 'boolean - Default checked state',
      required: 'boolean (optional) - Whether the field is required',
      disabled: 'boolean (optional) - Whether the field is disabled',
      description: 'string (optional) - Helper text shown below the switch',
    },
    example: {
      type: 'switch',
      label: 'Dark Mode',
      name: 'darkMode',
      checked: false,
      description: 'Enable dark mode for better night viewing',
    },
  },

  'tags-input': {
    description: 'Input field for adding multiple tags or keywords',
    properties: {
      type: 'tags-input',
      label: 'string - The label shown above the input',
      name: 'string - Unique identifier for the field',
      placeholder: 'string (optional) - Placeholder text',
      required: 'boolean (optional) - Whether the field is required',
      disabled: 'boolean (optional) - Whether the field is disabled',
      maxTags: 'number (optional) - Maximum number of tags allowed',
      description: 'string (optional) - Helper text shown below the input',
    },
    example: {
      type: 'tags-input',
      label: 'Keywords',
      name: 'keywords',
      placeholder: 'Type and press enter to add tags',
      maxTags: 5,
      description: 'Add up to 5 keywords to describe your content',
    },
  },

  textarea: {
    description: 'Multi-line text input field',
    properties: {
      type: 'textarea',
      label: 'string - The label shown above the textarea',
      name: 'string - Unique identifier for the field',
      placeholder: 'string (optional) - Placeholder text',
      required: 'boolean (optional) - Whether the field is required',
      disabled: 'boolean (optional) - Whether the field is disabled',
      rows: 'number (optional) - Number of visible text lines',
      maxLength: 'number (optional) - Maximum number of characters',
      description: 'string (optional) - Helper text shown below the textarea',
    },
    example: {
      type: 'textarea',
      label: 'Bio',
      name: 'bio',
      placeholder: 'Tell us about yourself',
      rows: 4,
      maxLength: 500,
      description: 'Maximum 500 characters',
    },
  },

  'location-input': {
    description: 'Country and state/province selection with smart defaults',
    properties: {
      type: 'location-input',
      label: 'string - The label shown above the input',
      name: 'string - Unique identifier for the field',
      required: 'boolean (optional) - Whether the field is required',
      disabled: 'boolean (optional) - Whether the field is disabled',
      defaultCountry: 'string (optional) - Default selected country',
      showStates:
        'boolean (optional) - Whether to show state/province selection',
      description: 'string (optional) - Helper text shown below the input',
    },
    example: {
      type: 'location-input',
      label: 'Location',
      name: 'location',
      defaultCountry: 'US',
      showStates: true,
      required: true,
      description: 'Select your country and state/province',
    },
  },

  'input-otp': {
    description: 'One-time password input with individual character boxes',
    properties: {
      type: 'input-otp',
      label: 'string - The label shown above the input',
      name: 'string - Unique identifier for the field',
      length: 'number - Number of OTP characters',
      required: 'boolean (optional) - Whether the field is required',
      disabled: 'boolean (optional) - Whether the field is disabled',
      description: 'string (optional) - Helper text shown below the input',
    },
    example: {
      type: 'input-otp',
      label: 'Verification Code',
      name: 'verificationCode',
      length: 6,
      required: true,
      description: 'Enter the 6-digit code sent to your phone',
    },
  },

  combobox: {
    description: 'Searchable dropdown with autocomplete functionality',
    properties: {
      type: 'combobox',
      label: 'string - The label shown above the input',
      name: 'string - Unique identifier for the field',
      placeholder: 'string (optional) - Placeholder text',
      options: 'array - Array of {label: string, value: string} objects',
      required: 'boolean (optional) - Whether the field is required',
      disabled: 'boolean (optional) - Whether the field is disabled',
      description: 'string (optional) - Helper text shown below the input',
    },
    example: {
      type: 'combobox',
      label: 'Programming Language',
      name: 'language',
      placeholder: 'Search languages...',
      options: [
        { label: 'JavaScript', value: 'js' },
        { label: 'TypeScript', value: 'ts' },
        { label: 'Python', value: 'py' },
      ],
      description: 'Search and select your primary programming language',
    },
  },

  // Add more field types based on your codebase...
}

const FormJsonBuilder = () => {
  const [jsonValue, setJsonValue] = React.useState<string>(
    JSON.stringify(defaultFormJson, null, 2),
  )
  const [formData, setFormData] = React.useState(defaultFormJson)
  const [error, setError] = React.useState<string>('')
  const [key, setKey] = React.useState(0)

  const handleJsonChange = (value: string) => {
    setJsonValue(value)
    try {
      const parsed = JSON.parse(value)
      setFormData(parsed)
      setError('')
    } catch (e) {
      setError('Invalid JSON format')
    }
  }

  const handleRefresh = () => {
    try {
      const parsed = JSON.parse(jsonValue)
      setFormData(parsed)
      setError('')
      setKey((prev) => prev + 1)
      toast.success('Form refreshed successfully')
    } catch (e) {
      setError('Invalid JSON format')
      toast.error('Failed to refresh form: Invalid JSON format')
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card className="p-4">
        <Accordion type="single" collapsible>
          <AccordionItem value="docs">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">Available Field Types</h2>
                <Badge variant="secondary">Documentation</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-4">
                <Accordion type="multiple" className="w-full">
                  {Object.entries(fieldTypesDocs).map(([type, doc]) => (
                    <AccordionItem value={type} key={type}>
                      <AccordionTrigger className="text-md font-semibold hover:no-underline">
                        {type}
                      </AccordionTrigger>
                      <AccordionContent className="space-y-2 px-4">
                        <p className="text-sm text-muted-foreground">
                          {doc.description}
                        </p>

                        <div className="mt-2">
                          <h4 className="text-sm font-medium">Properties:</h4>
                          <ul className="list-disc list-inside text-sm pl-4 text-muted-foreground">
                            {Object.entries(doc.properties).map(
                              ([prop, desc]) => (
                                <li key={prop}>
                                  <span className="font-mono text-xs">
                                    {prop}
                                  </span>
                                  : {desc}
                                </li>
                              ),
                            )}
                          </ul>
                        </div>

                        <div className="mt-2">
                          <h4 className="text-sm font-medium">Example:</h4>
                          <pre className="text-sm bg-slate-100 p-2 rounded-md">
                            {JSON.stringify(doc.example, null, 2)}
                          </pre>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>

      {/* Existing Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Form JSON Editor</h2>
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              Refresh Form
            </Button>
          </div>
          <Separator className="mb-4" />
          <ScrollArea className="h-[600px] w-full">
            <CodeMirror
              value={jsonValue}
              height="500px"
              onChange={handleJsonChange}
              theme="dark"
              basicSetup={{
                lineNumbers: true,
                highlightActiveLineGutter: true,
                highlightSpecialChars: true,
                foldGutter: true,
                drawSelection: true,
                dropCursor: true,
                allowMultipleSelections: true,
                indentOnInput: true,
                bracketMatching: true,
                closeBrackets: true,
                autocompletion: true,
                rectangularSelection: true,
                crosshairCursor: true,
                highlightActiveLine: true,
                highlightSelectionMatches: true,
                closeBracketsKeymap: true,
                defaultKeymap: true,
                searchKeymap: true,
                historyKeymap: true,
                foldKeymap: true,
                completionKeymap: true,
                lintKeymap: true,
              }}
            />
            {error && <div className="text-red-500 mt-2 text-sm">{error}</div>}
          </ScrollArea>
        </Card>

        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Form Preview</h2>
          <Separator className="mb-4" />
          <ScrollArea className="h-[600px] w-full">
            <FormRenderer key={key} formData={formData} />
          </ScrollArea>
        </Card>
      </div>
    </div>
  )
}

export default FormJsonBuilder
