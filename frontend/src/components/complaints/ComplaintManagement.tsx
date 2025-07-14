import { useState } from 'react';
import { Plus, AlertTriangle, Clock, CheckCircle, Eye, Image } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { NewComplaintDialog } from './NewComplaintDialog';

interface ComplaintManagementProps {
  userRole: 'admin' | 'member' | 'devops' | 'hr';
}

const mockComplaints = [
  {
    id: 1,
    title: 'Coffee machine not working',
    category: 'Pantry',
    description: 'The coffee machine in the main pantry is not dispensing coffee properly',
    reportedBy: 'John Doe',
    assignedTo: 'Admin Team',
    status: 'pending-verification',
    priority: 'medium',
    createdDate: '2024-01-15',
    location: 'Main Office - Floor 3',
    images: [
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400',
      'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400'
    ]
  },
  {
    id: 2,
    title: 'WiFi connectivity issues',
    category: 'Tech',
    description: 'Frequent disconnections and slow internet speed in the conference room',
    reportedBy: 'Sarah Smith',
    assignedTo: 'DevOps Team',
    status: 'verified',
    priority: 'high',
    createdDate: '2024-01-14',
    verifiedDate: '2024-01-15',
    location: 'Conference Room B',
    images: [
      'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400'
    ]
  },
  {
    id: 3,
    title: 'Air conditioning too cold',
    category: 'Others',
    description: 'The AC in the open workspace is set too cold, making it uncomfortable',
    reportedBy: 'Mike Johnson',
    assignedTo: 'Admin Team',
    status: 'resolved',
    priority: 'low',
    createdDate: '2024-01-13',
    resolvedDate: '2024-01-15',
    location: 'Open Workspace',
    images: []
  }
];

export function ComplaintManagement({ userRole }: ComplaintManagementProps) {
  const [showNewComplaint, setShowNewComplaint] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleImageClick = (images, index) => {
    setSelectedImages(images);
    setCurrentImageIndex(index);
    setShowImageModal(true);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % selectedImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + selectedImages.length) % selectedImages.length);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending-verification': return <Clock className="h-4 w-4" />;
      case 'verified': return <Eye className="h-4 w-4" />;
      case 'in-progress': return <AlertTriangle className="h-4 w-4" />;
      case 'resolved': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending-verification': return 'bg-yellow-100 text-yellow-800';
      case 'verified': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-orange-100 text-orange-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filterComplaints = (status?: string) => {
    if (!status) return mockComplaints;
    return mockComplaints.filter(complaint => complaint.status === status);
  };

  const renderComplaintCard = (complaint) => (
    <Card key={complaint.id}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h3 className="font-semibold">{complaint.title}</h3>
              <Badge className={getStatusColor(complaint.status)}>
                {getStatusIcon(complaint.status)}
                <span className="ml-1 capitalize">{complaint.status.replace('-', ' ')}</span>
              </Badge>
              <Badge className={getPriorityColor(complaint.priority)}>
                {complaint.priority}
              </Badge>
              <Badge variant="outline">{complaint.category}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{complaint.description}</p>
            
            {complaint.images && complaint.images.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Image className="h-4 w-4" />
                  <span className="text-sm font-medium">Attached Images ({complaint.images.length})</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {complaint.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Complaint image ${index + 1}`}
                      className="w-16 h-16 object-cover rounded-md border cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => handleImageClick(complaint.images, index)}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium">Reported by:</span>
                <p>{complaint.reportedBy}</p>
              </div>
              <div>
                <span className="font-medium">Assigned to:</span>
                <p>{complaint.assignedTo}</p>
              </div>
              <div>
                <span className="font-medium">Location:</span>
                <p>{complaint.location}</p>
              </div>
              <div>
                <span className="font-medium">Date:</span>
                <p>{complaint.createdDate}</p>
              </div>
            </div>
          </div>
          {userRole === 'admin' && (
            <div className="flex gap-2">
              {complaint.status === 'pending-verification' && (
                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4 mr-1" />
                  Verify
                </Button>
              )}
              {complaint.status === 'verified' && (
                <Button size="sm">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Mark Resolved
                </Button>
              )}
              <Button size="sm" variant="ghost">
                View Details
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold mb-2">Complaint Management</h2>
          <p className="text-muted-foreground">
            Track and resolve office complaints efficiently
          </p>
        </div>
        {(userRole === 'member' || userRole === 'devops' || userRole === 'hr') && (
          <Button onClick={() => setShowNewComplaint(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Complaint
          </Button>
        )}
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Complaints</TabsTrigger>
          <TabsTrigger value="pending-verification">Pending Verification</TabsTrigger>
          <TabsTrigger value="verified">Verified</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {mockComplaints.map((complaint) => renderComplaintCard(complaint))}
        </TabsContent>

        <TabsContent value="pending-verification">
          {filterComplaints('pending-verification').map((complaint) => renderComplaintCard(complaint))}
        </TabsContent>

        <TabsContent value="verified">
          {filterComplaints('verified').map((complaint) => renderComplaintCard(complaint))}
        </TabsContent>

        <TabsContent value="resolved">
          {filterComplaints('resolved').map((complaint) => renderComplaintCard(complaint))}
        </TabsContent>
      </Tabs>

      <Dialog open={showImageModal} onOpenChange={setShowImageModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              Complaint Images ({currentImageIndex + 1} of {selectedImages.length})
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center">
            <img
              src={selectedImages[currentImageIndex]}
              alt={`Complaint image ${currentImageIndex + 1}`}
              className="max-w-full max-h-[70vh] object-contain rounded-lg"
            />
          </div>
          {selectedImages.length > 1 && (
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

      <NewComplaintDialog 
        open={showNewComplaint} 
        onOpenChange={setShowNewComplaint}
      />
    </div>
  );
}
