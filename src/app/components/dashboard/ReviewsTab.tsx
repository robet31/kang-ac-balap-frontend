import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Star, User, ThumbsUp, MessageSquare, Edit, Trash2, Check, X, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { fetchTechnicians, updateTechnicianRating, Technician } from '../../utils/technician-sync';

const mockCompletedServices: any[] = [];

const mockTechnicianRatings = [
  {
    id: 'tech-001',
    name: 'Ari Wijaya',
    avatar: null,
    rating: 4.8,
    totalReviews: 156,
    specialization: 'Motor Sport & Matic'
  },
  {
    id: 'tech-002',
    name: 'Budi Santoso',
    avatar: null,
    rating: 4.9,
    totalReviews: 203,
    specialization: 'Motor Bebek & Matic'
  },
  {
    id: 'tech-003',
    name: 'Cahyo Pratama',
    avatar: null,
    rating: 4.7,
    totalReviews: 98,
    specialization: 'Motor Sport'
  }
];

function StarRating({ rating, size = 'md', interactive = false, onChange }: any) {
  const [hover, setHover] = useState(0);
  const sizeClass = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-8 h-8' : 'w-5 h-5';

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClass} ${
            (hover || rating) >= star
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-gray-300'
          } ${interactive ? 'cursor-pointer transition-colors' : ''}`}
          onMouseEnter={() => interactive && setHover(star)}
          onMouseLeave={() => interactive && setHover(0)}
          onClick={() => interactive && onChange(star)}
        />
      ))}
    </div>
  );
}

export function ReviewsTab() {
  const [services, setServices] = useState(mockCompletedServices);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [editingReview, setEditingReview] = useState<string | null>(null);
  const [editRating, setEditRating] = useState(0);
  const [editText, setEditText] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);
  const [technicians, setTechnicians] = useState<Technician[]>([]);

  useEffect(() => {
    fetchTechnicians().then(setTechnicians);
  }, []);

  const handleSubmitReview = () => {
    if (rating === 0) {
      toast.error('Mohon berikan rating terlebih dahulu');
      return;
    }
    if (!reviewText.trim()) {
      toast.error('Mohon tulis review Anda');
      return;
    }

    // Update the service with review
    setServices(services.map(s => 
      s.id === selectedService.id 
        ? { ...s, reviewed: true, rating, review: reviewText }
        : s
    ));

    toast.success('✅ Review berhasil dikirim! +50 poin loyalty untuk Anda');
    setSelectedService(null);
    setRating(0);
    setReviewText('');
  };

  const handleStartEdit = (service: any) => {
    setEditingReview(service.id);
    setEditRating(service.rating);
    setEditText(service.review);
  };

  const handleSaveEdit = (serviceId: string) => {
    if (editRating === 0) {
      toast.error('Mohon berikan rating');
      return;
    }
    if (!editText.trim()) {
      toast.error('Mohon tulis review Anda');
      return;
    }

    setServices(services.map(s => 
      s.id === serviceId 
        ? { ...s, rating: editRating, review: editText }
        : s
    ));

    toast.success('✅ Review berhasil diperbarui!');
    setEditingReview(null);
    setEditRating(0);
    setEditText('');
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
    setEditRating(0);
    setEditText('');
  };

  const handleDeleteReview = () => {
    if (!reviewToDelete) return;

    setServices(services.map(s => 
      s.id === reviewToDelete 
        ? { ...s, reviewed: false, rating: undefined, review: undefined }
        : s
    ));

    toast.success('🗑️ Review berhasil dihapus');
    setDeleteDialogOpen(false);
    setReviewToDelete(null);
  };

  const pendingReviews = services.filter(s => !s.reviewed);
  const completedReviews = services.filter(s => s.reviewed);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#2A5C82] to-[#1e4460] rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
            <Star className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Rating & Review</h2>
            <p className="text-white/90 text-sm">Beri rating dan bantu tingkatkan kualitas service</p>
          </div>
        </div>
      </div>

      {/* Review Form Modal */}
      {selectedService && (
        <Card className="border-2 border-[#2A5C82] shadow-lg">
          <CardHeader className="bg-gradient-to-r from-[#2A5C82] to-[#1e4460] text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Beri Review untuk Service Anda
            </CardTitle>
            <CardDescription className="text-gray-200">
              {selectedService.serviceName} - {selectedService.vehicle}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-3 text-sm text-blue-900">
                <Calendar className="w-4 h-4" />
                <span className="font-medium">
                  {new Date(selectedService.date).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                <span className="text-blue-600">•</span>
                <span>Teknisi: {selectedService.technician}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Rating Service
              </label>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <StarRating rating={rating} size="lg" interactive onChange={setRating} />
                <div>
                  <span className="text-2xl font-bold text-[#2A5C82]">
                    {rating > 0 ? `${rating}.0` : '0.0'}
                  </span>
                  <span className="text-sm text-gray-600 ml-1">/ 5.0</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Review Anda
              </label>
              <Textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Ceritakan pengalaman Anda dengan service ini..."
                rows={5}
                className="resize-none"
              />
              <div className="flex items-center gap-2 mt-2 text-xs text-gray-600">
                <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded">
                  <Star className="w-3 h-3" />
                  <span>+50 poin loyalty</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleSubmitReview}
                className="flex-1 bg-gradient-to-r from-[#2A5C82] to-[#1e4460] hover:from-[#1e4460] hover:to-[#2A5C82]"
              >
                <Check className="w-4 h-4 mr-2" />
                Kirim Review
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedService(null);
                  setRating(0);
                  setReviewText('');
                }}
              >
                <X className="w-4 h-4 mr-2" />
                Batal
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pending Reviews */}
      {pendingReviews.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-5 h-5 text-[#2A5C82]" />
            <h3 className="text-lg font-bold text-[#111827]">
              Menunggu Review
            </h3>
            <Badge className="bg-orange-500 text-white">{pendingReviews.length}</Badge>
          </div>
          <div className="grid gap-4">
            {pendingReviews.map((service) => (
              <Card key={service.id} className="hover:shadow-lg transition-all duration-300 border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-white">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
                        <MessageSquare className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-[#111827] text-lg">{service.serviceName}</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                          <span className="font-mono font-semibold">{service.vehicle}</span>
                          <span className="text-gray-400">•</span>
                          <span>{new Date(service.date).toLocaleDateString('id-ID')}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                          <User className="w-3 h-3" />
                          <span>Teknisi: {service.technician}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => setSelectedService(service)}
                      className="bg-gradient-to-r from-[#2A5C82] to-[#1e4460] hover:from-[#1e4460] hover:to-[#2A5C82] shadow-md"
                    >
                      <Star className="w-4 h-4 mr-2" />
                      Beri Review
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Completed Reviews with CRUD */}
      {completedReviews.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <ThumbsUp className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-bold text-[#111827]">
              Review Saya
            </h3>
            <Badge className="bg-green-500 text-white">{completedReviews.length}</Badge>
          </div>
          <div className="grid gap-4">
            {completedReviews.map((service) => (
              <Card key={service.id} className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-5">
                  {editingReview === service.id ? (
                    // Edit Mode
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-[#111827]">{service.serviceName}</h4>
                        <Badge variant="outline" className="text-xs">
                          Editing...
                        </Badge>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rating
                        </label>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <StarRating rating={editRating} size="md" interactive onChange={setEditRating} />
                          <span className="text-lg font-semibold text-[#2A5C82]">
                            {editRating}.0 / 5.0
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Review
                        </label>
                        <Textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          rows={4}
                          className="resize-none"
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleSaveEdit(service.id)}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                          size="sm"
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Simpan
                        </Button>
                        <Button
                          onClick={handleCancelEdit}
                          variant="outline"
                          size="sm"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Batal
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                        <ThumbsUp className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-bold text-[#111827] text-lg">{service.serviceName}</h4>
                            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                              <span className="font-mono font-semibold">{service.vehicle}</span>
                              <span className="text-gray-400">•</span>
                              <span>{new Date(service.date).toLocaleDateString('id-ID')}</span>
                            </div>
                          </div>
                          {/* CRUD Buttons - Top Right */}
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={() => handleStartEdit(service)}
                              variant="outline"
                              size="sm"
                              className="gap-1"
                            >
                              <Edit className="w-3 h-3" />
                              Edit
                            </Button>
                            <Button
                              onClick={() => {
                                setReviewToDelete(service.id);
                                setDeleteDialogOpen(true);
                              }}
                              variant="outline"
                              size="sm"
                              className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-3 h-3" />
                              Hapus
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                          <StarRating rating={service.rating} size="sm" />
                          <span className="text-sm font-bold text-[#2A5C82]">
                            {service.rating}.0
                          </span>
                        </div>

                        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-200">
                          {service.review}
                        </p>

                        <div className="flex items-center gap-2 mt-3">
                          <Badge variant="outline" className="text-xs">
                            <User className="w-3 h-3 mr-1" />
                            Teknisi: {service.technician}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Technician Ratings - Modern Grid */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-[#2A5C82]" />
          <h3 className="text-lg font-bold text-[#111827]">Rating Teknisi Kami</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {technicians.map((tech) => (
            <Card key={tech.id} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#2A5C82] to-[#1e4460] rounded-full flex items-center justify-center shadow-lg">
                    <User className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-[#111827]">{tech.name}</h4>
                    <p className="text-xs text-gray-600">{tech.specialization}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-2xl font-bold text-[#2A5C82]">{tech.rating}</span>
                  <span className="text-sm text-gray-600">/ 5.0</span>
                </div>

                <p className="text-xs text-gray-600 bg-gray-50 px-3 py-2 rounded">
                  {tech.totalReviews} review dari customer
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Review?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus review ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setReviewToDelete(null)}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteReview}
              className="bg-red-600 hover:bg-red-700"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}