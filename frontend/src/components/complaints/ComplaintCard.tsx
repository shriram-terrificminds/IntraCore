import { useState } from 'react';
import { Eye, Image, MessageSquare, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Complaint } from '@/types/Complaint';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';

interface ComplaintCardProps {
  complaint: Complaint;
  onStatusUpdate?: (complaintId: number, status: string, notes?: string) => void;
}

export function ComplaintCard({ complaint, onStatusUpdate }: ComplaintCardProps) {
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
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

  const getStatusColor = (status: Complaint['resolution_status']) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'In-progress': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Employee badge color map
  const employeeStatusStyle = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-300';
      case 'In-progress':
        return 'bg-orange-50 text-orange-700 border-orange-300';
      case 'Resolved':
        return 'bg-green-50 text-green-700 border-green-300';
      case 'Rejected':
        return 'bg-red-50 text-red-700 border-red-300';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-300';
    }
  };

  const canUpdateStatus = typeof complaint.role.name === 'string' && ['admin', 'hr', 'devops'].includes(complaint.role.name.toLowerCase());

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

  const handleStatusUpdate = async (newStatus: Complaint['resolution_status']) => {
    if (!onStatusUpdate) return;

    try {
      await onStatusUpdate(complaint.id, newStatus);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response.data.message,
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: Complaint['resolution_status']) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'In-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  let getStatusUpdateOptions: { value: Complaint['resolution_status'], label: string }[] = [];
  let disabled = false;
  switch (complaint.resolution_status) {
    case 'Pending':
      getStatusUpdateOptions = [
        { value: 'Pending', label: 'Pending' },
        { value: 'In-progress', label: 'In-progress' },
      ];
      break;
    case 'In-progress':
      getStatusUpdateOptions = [
        { value: 'In-progress', label: 'In-progress' },
        { value: 'Resolved', label: 'Resolved' },
        { value: 'Rejected', label: 'Rejected' },
      ];
      break;
    case 'Resolved':
    case 'Rejected':
    default:
      getStatusUpdateOptions = [
        { value: complaint.resolution_status, label: complaint.resolution_status },
      ];
      disabled = true;
      break;
  }

  console.log('Status options for ', complaint.complaint_number, ':', getStatusUpdateOptions);

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              {complaint.complaint_number && (
                <span className="font-bold text-black text-lg">
                  #{complaint.complaint_number}
                </span>
              )}
              <h3 className="font-semibold text-lg mt-0">{complaint.title}</h3>
            </div>
            {/* Status Dropdown for admin/hr/devops */}
            {canUpdateStatus ? (
              <div className="flex items-center gap-2">
                <Select
                  value={complaint.resolution_status}
                  onValueChange={value => {
                    if (value !== complaint.resolution_status) handleStatusUpdate(value as Complaint['resolution_status']);
                  }}
                  disabled={disabled}
                >
                  <SelectTrigger
                    className={`w-[120px] rounded-full border-0 font-semibold text-center flex items-center justify-center ${getStatusBadge(complaint.resolution_status)}`}
                    style={{ minHeight: '32px', paddingLeft: 0, paddingRight: 0 }}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {getStatusUpdateOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value} className={`rounded-full ${getStatusBadge(opt.value)}`}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : complaint.role.name && complaint.role.name.toLowerCase() === 'employee' ? (
              <span className={`inline-block px-3 py-1 rounded-md font-semibold text-xs uppercase tracking-wide border ${employeeStatusStyle(complaint.resolution_status)} shadow-sm`}
                style={{ minWidth: 90, textAlign: 'center' }}>
                {complaint.resolution_status}
              </span>
            ) : (
              <Badge className={`${getStatusColor(complaint.resolution_status)} border`}>
                {getStatusIcon(complaint.resolution_status)}
                <span className="ml-1">{complaint.resolution_status}</span>
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-4">{complaint.description}</p>
          {complaint.resolvedBy && (
            <p className="text-sm text-muted-foreground mb-2">
              <strong>Resolved By:</strong> {complaint.resolvedBy.name}
            </p>
          )}
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
          {/* Complaint Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm border-t pt-4">
            <div>
              <span className="font-medium text-muted-foreground">Reported by:</span>
              <p className="font-medium">{complaint.user.first_name && complaint.user.last_name ? `${complaint.user.first_name} ${complaint.user.last_name}` : complaint.user.name || 'Unknown'}</p>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">Department:</span>
              <p className="font-medium">{complaint.role.name}</p>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">Created on:</span>
              <p className="font-medium">{(() => {
                const d = new Date(complaint.created_at);
                const day = String(d.getDate()).padStart(2, '0');
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const year = d.getFullYear();
                return `${day}/${month}/${year}`;
              })()}</p>
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
    </>
  );
} 