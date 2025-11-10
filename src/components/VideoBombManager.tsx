import React, { useState, useRef } from 'react';
import { Video, Upload, Play, Pause, Trash2, Link as LinkIcon, X, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useApp, entities } from '../contexts/AppContext';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { toast } from 'sonner@2.0.3';
import { PageHeader } from './PageHeader';

export const VideoBombManager: React.FC = () => {
  const { selectedEntity, videoBombs, addVideoBomb, deleteVideoBomb, setMarketingTool } = useApp();
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const [uploadedVideo, setUploadedVideo] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [videoBombTitle, setVideoBombTitle] = useState('');
  const [videoBombEntity, setVideoBombEntity] = useState(selectedEntity);
  const [isDragging, setIsDragging] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedVideo(url);
        
        if (videoRef.current) {
          videoRef.current.srcObject = null;
          videoRef.current.src = url;
        }
        
        stream.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      };

      mediaRecorder.start();
      setIsRecording(true);
      setIsPaused(false);
    } catch (error) {
      console.error('Error accessing media devices:', error);
      if (error instanceof Error && error.name === 'NotAllowedError') {
        toast.error('Camera access denied. Please grant camera permissions or upload a video instead.');
      } else if (error instanceof Error && error.name === 'NotFoundError') {
        toast.error('No camera found. Please upload a video instead.');
      } else {
        toast.error('Could not access camera. Please upload a video instead.');
      }
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      setShowCreateDialog(true);
    }
  };

  const handleFileUpload = (file: File) => {
    if (file && file.type.startsWith('video/')) {
      const url = URL.createObjectURL(file);
      setUploadedVideo(url);
      setShowCreateDialog(true);
    } else {
      toast.error('Please upload a valid video file');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const createVideoBomb = () => {
    if (!videoBombTitle) {
      toast.error('Please enter a title');
      return;
    }

    const videoUrl = recordedVideo || uploadedVideo;
    if (!videoUrl) {
      toast.error('No video available');
      return;
    }

    addVideoBomb({
      entityId: videoBombEntity,
      videoUrl,
      title: videoBombTitle,
    });

    toast.success('Video Bomb created successfully!');
    setShowCreateDialog(false);
    setVideoBombTitle('');
    setRecordedVideo(null);
    setUploadedVideo(null);
  };

  const copyLink = (id: string) => {
    const link = `${window.location.origin}/?videobomb=${id}`;
    
    // Fallback clipboard method for environments where Clipboard API is blocked
    try {
      // Try modern clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(link).then(
          () => {
            toast.success('Link copied to clipboard!');
          },
          () => {
            // Fallback to old method
            fallbackCopyTextToClipboard(link);
          }
        );
      } else {
        // Use fallback method
        fallbackCopyTextToClipboard(link);
      }
    } catch (err) {
      fallbackCopyTextToClipboard(link);
    }
  };

  const fallbackCopyTextToClipboard = (text: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = '0';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        toast.success('Link copied to clipboard!');
      } else {
        toast.error('Failed to copy link. Please copy manually: ' + text);
      }
    } catch (err) {
      toast.error('Failed to copy link. Please copy manually: ' + text);
    }

    document.body.removeChild(textArea);
  };

  const filteredVideoBombs = selectedEntity === 'all' 
    ? videoBombs 
    : videoBombs.filter(vb => vb.entityId === selectedEntity);

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => setMarketingTool(null)}
        className="gap-2 -ml-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Marketing Hub
      </Button>

      <PageHeader 
        title="Video Bomb"
        subtitle="Create engaging video donation pages"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Record Video Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Record Video
            </CardTitle>
            <CardDescription>Record a video message for your donors</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-video bg-gray-100 dark:bg-[#1F1F1F] rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay={isRecording}
                playsInline
                muted={isRecording}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex gap-2">
              {!isRecording && !recordedVideo && (
                <Button onClick={startRecording} className="flex-1">
                  <Video className="h-4 w-4 mr-2" />
                  Start Recording
                </Button>
              )}
              
              {isRecording && (
                <>
                  {!isPaused ? (
                    <Button onClick={pauseRecording} variant="outline" className="flex-1">
                      <Pause className="h-4 w-4 mr-2" />
                      Pause
                    </Button>
                  ) : (
                    <Button onClick={resumeRecording} variant="outline" className="flex-1">
                      <Play className="h-4 w-4 mr-2" />
                      Resume
                    </Button>
                  )}
                  <Button onClick={stopRecording} variant="destructive">
                    Stop
                  </Button>
                </>
              )}
              
              {recordedVideo && !isRecording && (
                <>
                  <Button onClick={startRecording} variant="outline" className="flex-1">
                    Re-record
                  </Button>
                  <Button onClick={() => setShowCreateDialog(true)}>
                    Create Page
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upload Video Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Video
            </CardTitle>
            <CardDescription>Upload a pre-recorded video</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`aspect-video border-2 border-dashed rounded-lg flex items-center justify-center transition-colors ${
                isDragging
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            >
              <div className="text-center p-6">
                <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  Drag and drop your video here
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">or</p>
                <label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file);
                    }}
                    className="hidden"
                  />
                  <Button variant="outline" asChild>
                    <span>Browse Files</span>
                  </Button>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Created Video Bombs */}
      <Card>
        <CardHeader>
          <CardTitle>Your Video Bombs</CardTitle>
          <CardDescription>
            Manage and share your video donation pages
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredVideoBombs.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No video bombs created yet
            </div>
          ) : (
            <div className="space-y-3">
              {filteredVideoBombs.map((vb) => {
                const entity = entities.find(e => e.id === vb.entityId);
                return (
                  <div
                    key={vb.id}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-12 bg-gray-100 dark:bg-[#1F1F1F] rounded overflow-hidden">
                        <video src={vb.videoUrl} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="text-gray-900 dark:text-gray-100">{vb.title}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {entity?.name} • {new Date(vb.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyLink(vb.id)}
                      >
                        <LinkIcon className="h-4 w-4 mr-2" />
                        Copy Link
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          deleteVideoBomb(vb.id);
                          toast.success('Video Bomb deleted');
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Video Bomb Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Video Bomb</DialogTitle>
            <DialogDescription>
              Set up your video donation landing page
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="e.g., October Fundraising Campaign"
                value={videoBombTitle}
                onChange={(e) => setVideoBombTitle(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="entity">Nonprofit</Label>
              <Select value={videoBombEntity} onValueChange={(value: any) => setVideoBombEntity(value)}>
                <SelectTrigger id="entity">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {entities.filter(e => e.id !== 'all').map(entity => (
                    <SelectItem key={entity.id} value={entity.id}>
                      {entity.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={createVideoBomb} className="flex-1">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Create
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
