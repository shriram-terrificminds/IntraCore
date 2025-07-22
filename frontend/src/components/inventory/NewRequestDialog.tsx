
// import { useState } from 'react';
// import { Upload, X } from 'lucide-react';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { useToast } from '@/hooks/use-toast';

// interface NewRequestDialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   onSubmit: (item: string, quantity: number) => void;
// }

// export function NewRequestDialog({ open, onOpenChange, onSubmit }: NewRequestDialogProps) {
//   const [formData, setFormData] = useState({
//     title: '',
//     department: '',
//     description: '',
//   });
//   const { toast } = useToast();

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onSubmit(formData.item, 1); // Assuming quantity is always 1 for now or derive from form
//     toast({
//       title: "Request Submitted",
//       description: `Your inventory request "${formData.title}" has been submitted successfully.`,
//     });
    
//     // Reset form
//     setFormData({
//       title: '',
//       department: '',
//       description: '',
//     });
    
//     onOpenChange(false);
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-[500px]">
//         <DialogHeader>
//           <DialogTitle>Create New Request</DialogTitle>
//         </DialogHeader>
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="space-y-2">
//             <Label htmlFor="title">Title *</Label>
//             <Input
//               id="title"
//               value={formData.title}
//               onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//               placeholder="Enter request title"
//               required
//               className="w-full"
//             />
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="department">Role / Department *</Label>
//             <Select value={formData.department} onValueChange={(value) => setFormData({ ...formData, department: value })}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Select department" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="hr">HR</SelectItem>
//                 <SelectItem value="devops">DevOps</SelectItem>
//                 <SelectItem value="admin">Admin</SelectItem>
//                 <SelectItem value="finance">Finance</SelectItem>
//                 <SelectItem value="marketing">Marketing</SelectItem>
//                 <SelectItem value="engineering">Engineering</SelectItem>
//                 <SelectItem value="sales">Sales</SelectItem>
//                 <SelectItem value="support">Support</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="description">Description *</Label>
//             <Textarea
//               id="description"
//               value={formData.description}
//               onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//               placeholder="Describe your request in detail..."
//               required
//               className="min-h-[120px] resize-none"
//             />
//           </div>

//           <div className="flex justify-end gap-3 pt-4">
//             <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
//               Cancel
//             </Button>
//             <Button type="submit">
//               Submit Request
//             </Button>
//           </div>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }



import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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

interface NewRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (title: string, description: string, role_id: number) => void;
}

export function NewRequestDialog({ open, onOpenChange, onSubmit }: NewRequestDialogProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    role_id: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.role_id) return;

    onSubmit(formData.title, formData.description, parseInt(formData.role_id));

    // Reset form after submission
    setFormData({ title: '', description: '', role_id: '' });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Inventory Request</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Enter request title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Department / Role *</Label>
            <Select
              value={formData.role_id}
              onValueChange={(value) => setFormData({ ...formData, role_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Admin</SelectItem>
                <SelectItem value="2">HR</SelectItem>
                <SelectItem value="3">DevOps</SelectItem>
                <SelectItem value="4">Employee</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe your request..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              className="min-h-[120px] resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
