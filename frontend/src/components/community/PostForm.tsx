// src/components/community/PostForm.tsx
import React, { useState } from 'react';
import { Send, X } from 'lucide-react';
import type { CreatePostDto } from '../../types/community.types';
import { useCreatePost } from '../../hooks/useCommunities';
import {Input} from '../ui/input';
import {Button} from '../ui/button';

interface PostFormProps {
  communityId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  placeholder?: {
    title?: string;
    content?: string;
  };
  showCancel?: boolean;
  submitText?: string;
  className?: string;
}

interface FormData {
  title: string;
  content: string;
}

interface FormErrors {
  title?: string;
  content?: string;
}

const PostForm: React.FC<PostFormProps> = ({
  communityId,
  onSuccess,
  onCancel,
  placeholder = {
    title: "What's on your mind?",
    content: "Share your thoughts with the community..."
  },
  showCancel = false,
  submitText = "Create Post",
  className = ""
}) => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    content: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createPostMutation = useCreatePost();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters long';
    } else if (formData.title.trim().length > 200) {
      newErrors.title = 'Title must be less than 200 characters';
    }

    // Content validation
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    } else if (formData.content.trim().length < 10) {
      newErrors.content = 'Content must be at least 10 characters long';
    } else if (formData.content.trim().length > 5000) {
      newErrors.content = 'Content must be less than 5000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const postData: CreatePostDto = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        communityId
      };

      await createPostMutation.mutateAsync(postData);

      // Reset form
      setFormData({ title: '', content: '' });
      setErrors({});
      
      // Call success callback
      onSuccess?.();
    } catch (error) {
      console.error('Failed to create post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleCancel = () => {
    setFormData({ title: '', content: '' });
    setErrors({});
    onCancel?.();
  };

  const isLoading = isSubmitting || createPostMutation.isPending;

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title Input */}
        <div>
          <Input
            type="text"
            placeholder={placeholder.title}
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            disabled={isLoading}
            className={`text-lg font-medium ${
                errors.title ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
            }`}
            maxLength={200}
          />
          {errors.title && (
    <p className="text-sm text-red-500">{errors.title}</p>
  )}
  <div className="text-xs text-gray-500 text-right">
    {formData.title.length}/200
  </div>
          <div className="flex justify-between mt-1 text-xs text-gray-500">
            <span>{errors.title ? errors.title : ''}</span>
            <span>{formData.title.length}/200</span>
          </div>
        </div>

        {/* Content Textarea */}
        <div>
          <textarea
            placeholder={placeholder.content}
            value={formData.content}
            onChange={(e) => handleInputChange('content', e.target.value)}
            disabled={isLoading}
            rows={6}
            maxLength={5000}
            className={`w-full px-3 py-2 border rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.content 
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                : 'border-gray-300'
            } ${isLoading ? 'bg-gray-50 cursor-not-allowed' : ''}`}
          />
          <div className="flex justify-between mt-1 text-xs text-gray-500">
            <span className={errors.content ? 'text-red-500' : ''}>
              {errors.content ? errors.content : ''}
            </span>
            <span>{formData.content.length}/5000</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {showCancel && (
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancel}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </Button>
          )}
          
          <Button
            type="submit"
            disabled={isLoading || !formData.title.trim() || !formData.content.trim()}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                {submitText}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;