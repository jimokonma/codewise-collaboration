import { useToast as useToastContext } from "@/components/ui/toast"

export const useToast = () => {
  const context = useToastContext()
  
  const toast = (props: { title?: string; description?: string; variant?: 'default' | 'destructive' }) => {
    context.addToast(props)
  }

  return {
    toast,
    dismiss: context.removeToast
  }
}

export { toast } from "@/components/ui/toast"
