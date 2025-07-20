import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { X, Plus, Lock, Unlock } from 'lucide-react';
import { useCreateCommunity } from '../../hooks/useCommunities';
import type { CreateCommunityDto } from '../../types/community.types';

interface CreateCommunityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const suggestedTags = [
  'MERN', 'Python', 'JavaScript', 'React', 'Node.js', 'MongoDB',
  'Frontend', 'Backend', 'Full Stack', 'Data Science', 'Machine Learning',
  'DevOps', 'Cloud Computing', 'TypeScript', 'Next.js'
];

export const CreateCommunityModal: React.FC<CreateCommunityModalProps> = ({
  open,
  onOpenChange,
}) => {
  const [formData, setFormData] = useState<CreateCommunityDto>({
    name: '',
    description: '',
    tags: [],
    isPrivate: false,
  });
  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState<Partial<CreateCommunityDto>>({});

  const createCommunityMutation = useCreateCommunity();

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateCommunityDto> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Community name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Community name must be at least 3 characters';
    } else if (formData.name.length > 50) {
      newErrors.name = 'Community name must be less than 50 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    } else if (formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    if (formData.tags.length === 0) {
      newErrors.tags = ['Please add at least one tag'];
    } else if (formData.tags.length > 10) {
      newErrors.tags = ['Maximum 10 tags allowed'];
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await createCommunityMutation.mutateAsync(formData);
      handleClose();
    } catch (error) {
      // Error handling is done in the mutation
      console.error('Failed to create community:', error);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      tags: [],
      isPrivate: false,
    });
    setNewTag('');
    setErrors({});
    onOpenChange(false);
  };

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !formData.tags.includes(trimmedTag) && formData.tags.length < 10) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, trimmedTag]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(newTag);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create New Community
          </DialogTitle>
          <DialogDescription>
            Create a space for like-minded learners to connect and share knowledge.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Community Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Community Name *</Label>
            <Input
              id="name"
              placeholder="e.g., MERN Stack Developers"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe what your community is about, what members will learn, and how they can contribute..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className={`min-h-[100px] resize-none ${errors.description ? 'border-red-500' : ''}`}
              maxLength={500}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{errors.description && <span className="text-red-600">{errors.description}</span>}</span>
              <span>{formData.description.length}/500</span>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-3">
            <Label>Tags * (Help others find your community)</Label>
            
            {/* Add Tag Input */}
            <div className="flex gap-2">
              <Input
                placeholder="Add a tag (press Enter)"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addTag(newTag)}
                disabled={!newTag.trim() || formData.tags.includes(newTag.trim()) || formData.tags.length >= 10}
              >
                Add
              </Button>
            </div>

            {/* Selected Tags */}
            {formData.tags.length > 0 && (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="default" className="cursor-pointer hover:bg-blue-700">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:bg-blue-800 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-gray-500">
                  {formData.tags.length}/10 tags • Click on a tag to remove it
                </p>
              </div>
            )}

            {/* Suggested Tags */}
            <div className="space-y-2">
              <Label className="text-sm text-gray-600">Suggested tags:</Label>
              <div className="flex flex-wrap gap-1">
                {suggestedTags
                  .filter(tag => !formData.tags.includes(tag))
                  .slice(0, 8)
                  .map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="cursor-pointer hover:bg-gray-100"
                      onClick={() => addTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
              </div>
            </div>

            {errors.tags && (
              <p className="text-sm text-red-600">{errors.tags[0]}</p>
            )}
          </div>

          {/* Privacy Setting */}
          <div className="space-y-3">
            <Label>Community Privacy</Label>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                {formData.isPrivate ? (
                  <Lock className="h-5 w-5 text-red-500" />
                ) : (
                  <Unlock className="h-5 w-5 text-green-500" />
                )}
                <div>
                  <p className="font-medium">
                    {formData.isPrivate ? 'Private Community' : 'Public Community'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {formData.isPrivate
                      ? 'Only invited members can see and join this community'
                      : 'Anyone can discover and join this community'
                    }
                  </p>
                </div>
              </div>
              <Switch
                checked={formData.isPrivate}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPrivate: checked }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={createCommunityMutation.isPending}
              className="min-w-[100px]"
            >
              {createCommunityMutation.isPending ? 'Creating...' : 'Create Community'}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};