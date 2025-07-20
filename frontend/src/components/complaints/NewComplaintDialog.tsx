import { useRef, useState } from 'react';
import { Upload, X, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface NewComplaintDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ROLES = [
  { id: 1, name: 'Admin' },
  { id: 2, name: 'HR' },
  { id: 3, name: 'DevOps' },
  { id: 4, name: 'Employee' },
  { id: 5, name: 'Manager' },
];

export function NewComplaintDialog({ open, onOpenChange }: NewComplaintDialogProps) {
  const [formData, setFormData] = useState({
    title: '',
    role_id: '',
    description: '',
  });

  const [images, setImages] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.role_id) {
      newErrors.role_id = 'Please select a role/department';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (images.length > 5) {
      newErrors.images = 'Maximum 5 images allowed';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const totalImages = images.length + newFiles.length;
      
      if (totalImages > 5) {
        toast({
          title: 'Too many images',
          description: 'Maximum 5 images allowed',
          variant: 'destructive',
        });
        return;
      }

      // Validate file types and sizes
      const validFiles = newFiles.filter(file => {
        if (!file.type.startsWith('image/')) {
          toast({
            title: 'Invalid file type',
            description: `${file.name} is not an image file`,
            variant: 'destructive',
          });
          return false;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB
          toast({
            title: 'File too large',
            description: `${file.name} is larger than 5MB`,
            variant: 'destructive',
          });
          return false;
        }

        return true;
      });

      setImages([...images, ...validFiles]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Complaint Submitted',
        description: 'Your complaint has been submitted and will be reviewed shortly.',
      });
      
      // Reset form
      setFormData({
        title: '',
        role_id: '',
        description: '',
      });
      setImages([]);
      setErrors({});
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit complaint. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        title: '',
        role_id: '',
        description: '',
      });
      setImages([]);
      setErrors({});
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submit New Complaint</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                if (errors.title) setErrors({ ...errors, title: '' });
              }}
              placeholder="Brief description of the issue"
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && (
              <p className="text-sm text-red-500 mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <Label htmlFor="role">Role/Department *</Label>
            <Select
              value={formData.role_id}
              onValueChange={(value) => {
                setFormData({ ...formData, role_id: value });
                if (errors.role_id) setErrors({ ...errors, role_id: '' });
              }}
            >
              <SelectTrigger className={errors.role_id ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select role/department" />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map(role => (
                  <SelectItem key={role.id} value={role.id.toString()}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.role_id && (
              <p className="text-sm text-red-500 mt-1">{errors.role_id}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value });
                if (errors.description) setErrors({ ...errors, description: '' });
              }}
              placeholder="Provide detailed information about the issue..."
              className={`min-h-[120px] ${errors.description ? 'border-red-500' : ''}`}
            />
            {errors.description && (
              <p className="text-sm text-red-500 mt-1">{errors.description}</p>
            )}
          </div>

          <div>
            <Label>Supporting Images (Optional)</Label>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                images.length >= 5 
                  ? 'border-gray-300 bg-gray-50 cursor-not-allowed' 
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              }`}
              onClick={() => images.length < 5 && fileInputRef.current?.click()}
            >
              <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-500 mb-1">
                Click or drag to upload images
              </p>
              <p className="text-xs text-gray-400">
                Max 5 images • PNG/JPG only • 5MB max per file
              </p>
              {images.length > 0 && (
                <p className="text-xs text-blue-600 mt-2">
                  {images.length}/5 images selected
                </p>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageChange}
            />

            {errors.images && (
              <Alert className="mt-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.images}</AlertDescription>
              </Alert>
            )}

            {images.length > 0 && (
              <div className="mt-3 grid grid-cols-3 gap-2">
                {images.map((file, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={URL.createObjectURL(file)}
                      className="w-full h-20 object-cover rounded border"
                      alt={`Upload ${idx + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
