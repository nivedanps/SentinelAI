import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { EmergencyResource, ResourceCategory, ResourcePriority, ResourceStatus } from '../types/resource.types';

interface ResourceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: EmergencyResource | null;
}

export const ResourceFormModal: React.FC<ResourceFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [formData, setFormData] = useState({
    resource_id: '',
    name: '',
    category: 'Emergency Vehicles' as ResourceCategory,
    type: 'Ambulance',
    organization_agency: 'Health Department',
    status: 'AVAILABLE' as ResourceStatus,
    priority: 'MEDIUM' as ResourcePriority,
    latitude: 12.3,
    longitude: 76.65,
    location_name: 'Mysuru Staging Depot',
    capacity: 'Standard',
    contact: '',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        resource_id: initialData.resource_id,
        name: initialData.name,
        category: initialData.category,
        type: initialData.type,
        organization_agency: initialData.organization_agency,
        status: initialData.status,
        priority: initialData.priority,
        latitude: initialData.latitude,
        longitude: initialData.longitude,
        location_name: initialData.location_name,
        capacity: initialData.capacity || '',
        contact: initialData.contact || '',
        notes: initialData.notes || '',
      });
    } else {
      setFormData({
        resource_id: `RES-${Math.floor(100 + Math.random() * 900)}`,
        name: '',
        category: 'Emergency Vehicles',
        type: 'Ambulance',
        organization_agency: 'Health Department',
        status: 'AVAILABLE',
        priority: 'MEDIUM',
        latitude: 12.3,
        longitude: 76.65,
        location_name: 'Mysuru Staging Depot',
        capacity: 'Standard',
        contact: '',
        notes: '',
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.location_name.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save resource');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h2 className="text-base font-bold text-white tracking-wide">
            {initialData ? 'Edit Resource' : '+ Add New Emergency Resource'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Row 1: ID & Name */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                Resource ID *
              </label>
              <input
                type="text"
                required
                value={formData.resource_id}
                onChange={(e) => setFormData({ ...formData, resource_id: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-white font-mono font-bold focus:border-blue-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                Resource Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Inflatable Rescue Boat RB-008"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-white focus:border-blue-500"
              />
            </div>
          </div>

          {/* Row 2: Category, Type, Agency */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value as ResourceCategory })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-white focus:border-blue-500"
              >
                <option value="Emergency Vehicles">Emergency Vehicles</option>
                <option value="Rescue Equipment">Rescue Equipment</option>
                <option value="Personnel">Personnel</option>
                <option value="Supplies">Supplies</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                Type *
              </label>
              <input
                type="text"
                required
                placeholder="Ambulance, Rescue Boat..."
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-white focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                Organization / Agency *
              </label>
              <input
                type="text"
                required
                placeholder="NDRF, Health Dept..."
                value={formData.organization_agency}
                onChange={(e) => setFormData({ ...formData, organization_agency: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-white focus:border-blue-500"
              />
            </div>
          </div>

          {/* Row 3: Status & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                Status *
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as ResourceStatus })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-white focus:border-blue-500 font-bold"
              >
                <option value="AVAILABLE">AVAILABLE</option>
                <option value="DEPLOYED">DEPLOYED</option>
                <option value="RESERVED">RESERVED</option>
                <option value="MAINTENANCE">MAINTENANCE</option>
                <option value="UNAVAILABLE">UNAVAILABLE</option>
                <option value="LOST">LOST</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                Priority *
              </label>
              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value as ResourcePriority })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-white focus:border-blue-500 font-bold"
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="CRITICAL">CRITICAL</option>
              </select>
            </div>
          </div>

          {/* Row 4: Location & Coordinates */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1">
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                Latitude *
              </label>
              <input
                type="number"
                step="any"
                required
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-white font-mono"
              />
            </div>

            <div className="sm:col-span-1">
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                Longitude *
              </label>
              <input
                type="number"
                step="any"
                required
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-white font-mono"
              />
            </div>

            <div className="sm:col-span-1">
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                Location Name *
              </label>
              <input
                type="text"
                required
                placeholder="Mysuru Staging Depot"
                value={formData.location_name}
                onChange={(e) => setFormData({ ...formData, location_name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-white"
              />
            </div>
          </div>

          {/* Row 5: Capacity & Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                Capacity / Specification
              </label>
              <input
                type="text"
                placeholder="e.g. 10 Evacuees + 4 Crew"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-white"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                Contact Number
              </label>
              <input
                type="text"
                placeholder="+91 98450 11201"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-white font-mono"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              Operator Notes
            </label>
            <textarea
              rows={3}
              placeholder="Additional operational instructions or maintenance history..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-white"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : initialData ? 'Update Resource' : 'Create Resource'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
