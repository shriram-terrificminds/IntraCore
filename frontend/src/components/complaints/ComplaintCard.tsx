import { useState } from 'react';
import { Eye, Image, MessageSquare, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { User } from '../../types'; // Import User to get UserRole

interface ComplaintCardProps {
  complaint: {
    id: number;
    title: string;
    description: string;
    role: { name: string };
    resolution_status: string;
    resolution_notes?: string;
    created_at: string;
    resolved_at?: string;
    user: { name: string };
    resolvedBy?: { name: string };
    images: Array<{ image_url: string }>;
  };
  userRole: User['role']; // Corrected type for userRole
  onStatusUpdate?: (complaintId: number, status: string, notes?: string) => void;
}

export function ComplaintCard({ complaint, userRole, onStatusUpdate }: ComplaintCardProps) {
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [newStatus, setNewStatus] = useState(complaint.resolution_status);
  const [resolutionNotes, setResolutionNotes] = useState(complaint.resolution_notes || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return <Clock className="h-4 w-4" />;
      case 'In-progress': return <AlertTriangle className="h-4 w-4" />;
      case 'Resolved': return <CheckCircle className="h-4 w-4" />;
      case 'Rejected': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'In-progress': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const canUpdateStatus = userRole === 'admin' || userRole === 'hr' || userRole === 'devops';

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setShowImageModal(true);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % complaint.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + complaint.images.length) % complaint.images.length);
  };

  const handleStatusUpdate = async () => {
    if (!onStatusUpdate) return;

    setIsUpdating(true);
    try {
      await onStatusUpdate(complaint.id, newStatus, resolutionNotes);
      setShowStatusDialog(false);
      toast({
        title: 'Status Updated',
        description: 'Complaint status has been updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update status. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusUpdateOptions = () => {
    switch (complaint.resolution_status) {
      case 'Pending':
        return ['In-progress', 'Resolved', 'Rejected'];
      case 'In-progress':
        return ['Resolved', 'Rejected'];
      default:
        return [];
    }
  };

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <Badge variant="outline" className="font-mono">
                  REQ-{complaint.id.toString().padStart(3, '0')}
                </Badge>
                <Badge className={`${getStatusColor(complaint.resolution_status)} border`}>
                  {getStatusIcon(complaint.resolution_status)}
                  <span className="ml-1">{complaint.resolution_status}</span>
                </Badge>
                <Badge variant="outline">{complaint.role.name}</Badge>
              </div>
              <h3 className="font-semibold text-lg mb-2">{complaint.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{complaint.description}</p>
            </div>

            {canUpdateStatus && getStatusUpdateOptions().length > 0 && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setShowStatusDialog(true)}
              >
                Update Status
              </Button>
            )}
          </div>

          {/* Images Preview */}
          {complaint.images && complaint.images.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Image className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Attached Images ({complaint.images.length})
                </span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {complaint.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={`/storage/${image.image_url}`}
                      alt={`Complaint image ${index + 1}`}
                      className="w-16 h-16 object-cover rounded-md border cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => handleImageClick(index)}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all rounded-md flex items-center justify-center">
                      <Eye className="h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resolution Notes */}
          {complaint.resolution_notes && (
            <div className="mb-4 p-3 bg-blue-50 rounded-md">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Resolution Notes</span>
              </div>
              <p className="text-sm text-blue-700">{complaint.resolution_notes}</p>
            </div>
          )}

          {/* Complaint Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm border-t pt-4">
            <div>
              <span className="font-medium text-muted-foreground">Reported by:</span>
              <p className="font-medium">{complaint.user.name}</p>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">Department:</span>
              <p className="font-medium">{complaint.role.name}</p>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">Created:</span>
              <p className="font-medium">{new Date(complaint.created_at).toLocaleDateString()}</p>
            </div>
            {complaint.resolved_at && (
              <div>
                <span className="font-medium text-muted-foreground">Resolved:</span>
                <p className="font-medium">{new Date(complaint.resolved_at).toLocaleDateString()}</p>
                {complaint.resolvedBy && (
                  <p className="text-xs text-muted-foreground">by {complaint.resolvedBy.name}</p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Image Modal */}
      <Dialog open={showImageModal} onOpenChange={setShowImageModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              Complaint Images ({currentImageIndex + 1} of {complaint.images.length})
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center">
            <img
              src={`/storage/${complaint.images[currentImageIndex]?.image_url}`}
              alt={`Complaint image ${currentImageIndex + 1}`}
              className="max-w-full max-h-[70vh] object-contain rounded-lg"
            />
          </div>
          {complaint.images.length > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              <Button variant="outline" onClick={prevImage}>
                Previous
              </Button>
              <Button variant="outline" onClick={nextImage}>
                Next
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Status Update Dialog */}
      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Update Complaint Status</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">New Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              >
                {getStatusUpdateOptions().map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            {(newStatus === 'Resolved' || newStatus === 'Rejected' || newStatus === 'In-progress') && (
              <div>
                <label className="text-sm font-medium">Resolution Notes</label>
                <Textarea
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="Add notes about the resolution..."
                  className="mt-1 min-h-[100px]"
                />
              </div>
            )}

            <div className="flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowStatusDialog(false)}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleStatusUpdate}
                disabled={isUpdating}
              >
                {isUpdating ? 'Updating...' : 'Update Status'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 