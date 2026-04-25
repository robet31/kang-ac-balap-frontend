import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Upload, FileText, Download, Eye, Trash2, File } from 'lucide-react';
import { toast } from 'sonner';

const mockDocuments = [
  {
    id: '1',
    name: 'STNK - Honda CB150R.pdf',
    type: 'STNK',
    vehicle: 'B 1234 XYZ',
    size: '2.3 MB',
    uploadDate: '2025-12-01',
    url: '#'
  },
  {
    id: '2',
    name: 'BPKB - Honda CB150R.pdf',
    type: 'BPKB',
    vehicle: 'B 1234 XYZ',
    size: '1.8 MB',
    uploadDate: '2025-12-01',
    url: '#'
  },
  {
    id: '3',
    name: 'Invoice Service Jan 2026.pdf',
    type: 'Invoice',
    vehicle: 'B 1234 XYZ',
    size: '456 KB',
    uploadDate: '2026-01-15',
    url: '#'
  },
  {
    id: '4',
    name: 'STNK - Yamaha NMAX.pdf',
    type: 'STNK',
    vehicle: 'B 5678 ABC',
    size: '2.1 MB',
    uploadDate: '2025-11-20',
    url: '#'
  },
  {
    id: '5',
    name: 'Warranty Certificate.pdf',
    type: 'Warranty',
    vehicle: 'B 1234 XYZ',
    size: '890 KB',
    uploadDate: '2025-10-10',
    url: '#'
  }
];

const documentTypes = [
  { value: 'stnk', label: 'STNK', color: 'bg-blue-500' },
  { value: 'bpkb', label: 'BPKB', color: 'bg-green-500' },
  { value: 'invoice', label: 'Invoice', color: 'bg-orange-500' },
  { value: 'warranty', label: 'Warranty', color: 'bg-purple-500' },
  { value: 'other', label: 'Lainnya', color: 'bg-gray-500' }
];

export function DocumentsTab() {
  const [documents, setDocuments] = useState(mockDocuments);
  const [selectedType, setSelectedType] = useState('all');

  const handleUpload = () => {
    // Implementasi file upload
    toast.info('Fitur upload dokumen akan segera tersedia!');
  };

  const handleView = (doc: any) => {
    toast.info(`Melihat dokumen: ${doc.name}`);
  };

  const handleDownload = (doc: any) => {
    toast.success(`Mengunduh dokumen: ${doc.name}`);
  };

  const handleDelete = (id: string) => {
    setDocuments(documents.filter(doc => doc.id !== id));
    toast.success('Dokumen berhasil dihapus');
  };

  const filteredDocs = selectedType === 'all' 
    ? documents 
    : documents.filter(doc => doc.type.toLowerCase() === selectedType);

  const getTypeColor = (type: string) => {
    const typeObj = documentTypes.find(t => t.value === type.toLowerCase());
    return typeObj?.color || 'bg-gray-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#111827] mb-2">Dokumen Saya</h2>
          <p className="text-gray-600">Simpan dan kelola semua dokumen kendaraan Anda</p>
        </div>
        <Button onClick={handleUpload} className="bg-[#2A5C82] hover:bg-[#1e4460]">
          <Upload className="w-4 h-4 mr-2" />
          Upload Dokumen
        </Button>
      </div>

      {/* Upload Zone */}
      <Card className="border-2 border-dashed border-gray-300 hover:border-[#2A5C82] transition-colors cursor-pointer">
        <CardContent className="py-12">
          <div className="text-center" onClick={handleUpload}>
            <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-[#111827] mb-2">
              Upload Dokumen Baru
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Drag & drop file atau klik untuk browse
            </p>
            <p className="text-xs text-gray-500">
              Mendukung: PDF, JPG, PNG (Max 10MB)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Document Type Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <Button
          variant={selectedType === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedType('all')}
          className={selectedType === 'all' ? 'bg-[#2A5C82]' : ''}
        >
          Semua ({documents.length})
        </Button>
        {documentTypes.map((type) => (
          <Button
            key={type.value}
            variant={selectedType === type.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedType(type.value)}
            className={selectedType === type.value ? type.color : ''}
          >
            {type.label} ({documents.filter(d => d.type.toLowerCase() === type.value).length})
          </Button>
        ))}
      </div>

      {/* Documents Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc) => (
          <Card key={doc.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <Badge className={`${getTypeColor(doc.type)} text-white mb-2`}>
                    {doc.type}
                  </Badge>
                  <CardTitle className="text-base line-clamp-2">{doc.name}</CardTitle>
                  <CardDescription className="mt-1">{doc.vehicle}</CardDescription>
                </div>
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Ukuran:</span>
                  <span className="font-medium">{doc.size}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Upload:</span>
                  <span className="font-medium">
                    {new Date(doc.uploadDate).toLocaleDateString('id-ID')}
                  </span>
                </div>
                <div className="flex gap-2 pt-2 border-t">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleView(doc)}
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    Lihat
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleDownload(doc)}
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Download
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:bg-red-50"
                    onClick={() => handleDelete(doc.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDocs.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <File className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Tidak Ada Dokumen
            </h3>
            <p className="text-gray-600 mb-6">
              Tidak ada dokumen {selectedType === 'all' ? '' : selectedType} yang tersimpan
            </p>
            <Button onClick={handleUpload} className="bg-[#2A5C82] hover:bg-[#1e4460]">
              <Upload className="w-4 h-4 mr-2" />
              Upload Dokumen Pertama
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-[#111827] mb-1">Keamanan Dokumen Terjamin</h4>
              <p className="text-sm text-gray-700">
                Semua dokumen Anda disimpan dengan enkripsi dan hanya Anda yang dapat mengaksesnya. 
                Dokumen akan tersimpan secara permanen dan dapat diakses kapan saja.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
