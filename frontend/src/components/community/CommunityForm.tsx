import React, { useState, useEffect } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"
import {  useUpdateCommunity } from '../../hooks/useCommunities';
import type { CreateCommunityDto, UpdateCommunityDto, Community } from '../../types/community.types';

interface CommunityFormProps {
  initialValues?: Partial<Community>;
  onSubmit?: (data: CreateCommunityDto | UpdateCommunityDto) => void;
  isEditing?: boolean;
  onCancel?: () => void;
  className?: string;
}

interface FormData {
  name: string;
  description: string;
  tags: string[];
  isPrivate: boolean;
}

const CommunityForm: React.FC<CommunityFormProps> = ({
  initialValues,
  onSubmit,
  isEditing = false,
  onCancel,
  className = ""
}) => {
//   const createMutation = useCreateCommunity();
  const updateMutation = useUpdateCommunity();
  
  const [formData, setFormData] = useState<FormData>({
    name: initialValues?.name || '',
    description: initialValues?.description || '',
    tags: initialValues?.tags || [],
    isPrivate: initialValues?.isPrivate || false,
  });

  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Partial<FormData>>({});

  // Update form data when initialValues change
  useEffect(() => {
    if (initialValues) {
      setFormData({
        name: initialValues.name || '',
        description: initialValues.description || '',
        tags: initialValues.tags || [],
        isPrivate: initialValues.isPrivate || false,
      });
    }
  }, [initialValues]);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

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

    if (formData.tags.length > 10) {
      newErrors.tags = ['Maximum 10 tags allowed'];
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase();
    
    if (!tag) return;
    
    if (formData.tags.includes(tag)) {
      setTagInput('');
      return;
    }
    
    if (formData.tags.length >= 10) {
      setErrors(prev => ({ ...prev, tags: ['Maximum 10 tags allowed'] }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      tags: [...prev.tags, tag]
    }));
    setTagInput('');
    
    // Clear tags error
    if (errors.tags) {
      setErrors(prev => ({ ...prev, tags: undefined }));
    }
  };

  const handleRemoveTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const submissionData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      tags: formData.tags,
      isPrivate: formData.isPrivate,
    };

     console.log('Form submission data:', submissionData);

    try {
      if (isEditing && initialValues?._id) {
        await updateMutation.mutateAsync({
          id: initialValues._id,
          data: submissionData as UpdateCommunityDto
        });
      }
    //    else {
    //     await createMutation.mutateAsync(submissionData as CreateCommunityDto);
    //   }
      
      if (onSubmit) {
        onSubmit(submissionData);
      }
    } catch (error) {
      // Error is handled by the mutation hooks
    }
  };

//   const isLoading = createMutation.isPending || updateMutation.isPending;
  const isLoading = isEditing ? updateMutation.isPending : false;
  return (
    <Card className={`p-6 ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Form Title */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {isEditing ? 'Edit Community' : 'Create New Community'}
          </h2>
          <p className="text-gray-600 text-sm">
            {isEditing 
              ? 'Update your community information' 
              : 'Fill in the details to create your community'
            }
          </p>
        </div>

        {/* Community Name */}
        {/* <div>
          <Input
            label="Community Name"
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter community name"
            error={errors.name}
            required
            maxLength={50}
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.name.length}/50 characters
          </p>
        </div> */}

<div className="space-y-2">
  <Label htmlFor="name">Community Name</Label>
  <Input
    id="name"
    type="text"
    value={formData.name}
    onChange={(e) => handleInputChange('name', e.target.value)}
    placeholder="Enter community name"
    required
    maxLength={50}
  />
  {errors.name && (
    <p className="text-sm font-medium text-destructive">{errors.name}</p>
  )}
  <p className="text-xs text-muted-foreground">
    {formData.name.length}/50 characters
  </p>
</div>

        {/* Description */}
        {/* <div>
          <Input
            label="Description"
            as="textarea"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Describe what your community is about..."
            error={errors.description}
            required
            rows={4}
            maxLength={500}
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.description.length}/500 characters
          </p>
        </div> */}


<div className="space-y-2">
  <Label htmlFor="description">Description</Label>
  <Textarea
    id="description"
    value={formData.description}
    onChange={(e) => handleInputChange('description', e.target.value)}
    placeholder="Describe what your community is about..."
    required
    rows={4}
    maxLength={500}
  />
  {errors.description && (
    <p className="text-sm font-medium text-destructive">{errors.description}</p>
  )}
  <p className="text-xs text-muted-foreground">
    {formData.description.length}/500 characters
  </p>
</div>
        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          
          {/* Tag Input */}
          <div className="flex gap-2 mb-3">
            <Input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={handleTagKeyPress}
              placeholder="Add tags (e.g., programming, study, math)"
              className="flex-1"
            />
            <Button
              type="button"
              onClick={handleAddTag}
              variant="outline"
              disabled={!tagInput.trim() || formData.tags.length >= 10}
            >
              Add
            </Button>
          </div>

          {/* Tags Display */}
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(index)}
                    className="ml-1 hover:text-blue-600"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}

          <p className="text-xs text-gray-500">
            {formData.tags.length}/10 tags
          </p>
          
          {errors.tags && (
            <p className="text-red-600 text-sm mt-1">{errors.tags[0]}</p>
          )}
        </div>

        {/* Privacy Setting */}
        <div>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.isPrivate}
              onChange={(e) => handleInputChange('isPrivate', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <div>
              <span className="text-sm font-medium text-gray-700">Private Community</span>
              <p className="text-xs text-gray-500">
                Only members can see posts and content
              </p>
            </div>
          </label>
        </div>

        {/* Form Actions */}
        <div className="flex gap-3 pt-4 border-t">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {isEditing ? 'Updating...' : 'Creating...'}
              </div>
            ) : (
              isEditing ? 'Update Community' : 'Create Community'
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default CommunityForm;