import React , {useEffect,useState} from 'react';
import api from '../constants/api.js';
export default function HospitalEmergencyBedsTab(){
    const [emergencyBeds,setEmergencyBeds]=useState(0);
    const [availableEmergencyBeds,setAvailableEmergencyBeds]=useState(0);
    const [loading,setLoading]=useState(true);
    const [saving,setSaving]=useState(false);
    const [message,setMessage]=useState('');
    const [error,setError]=useState('');
    useEffect(()=>{
        fetchBeds();
    },[]);
    const fetchBeds=async()=>{
        try{
          setLoading(true);
          setError('');
          const response=await api.get('/hospitals/my/emergency-beds');
          setEmergencyBeds(response.data.emergencyBeds);
          setAvailableEmergencyBeds(response.data.availableEmergencyBeds);
        }catch(err){
          console.error('Failed to fetch emergency beds:',err);
          setError(
            err?.response?.data?.error ||
            'Failed to load emergency bed information.'
          );
        } finally {
            setLoading(false);
        }
    };
    const handleSave=async()=>{
        setMessage('');
        setError('');
        if(emergencyBeds<0 || availableEmergencyBeds<0){
            setError('Bed numbers cannot be negaative');
            return;
        }
        if(availableEmergencyBeds>emergencyBeds){
            setError(
                `Available beds cannot be greater than total emergency beds.`
            );
            return;
        }
        try{
            setSaving(true);
            const response=await api.put(
                '/hospitals/my/emergency-beds',
                {
                  emergencyBeds,
                  availableEmergencyBeds
                }
            );
            setEmergencyBeds(response.data.emergencyBeds);
            setAvailableEmergencyBeds(response.data.availableEmergencyBeds);
            setMessage('Emergency bed information updated successfully');
        }catch(err){
            console.error('Failed to update emergency beds:',err);
            setError(
                err?.response?.data?.error ||
                'Failed to update emergency bed information.'
            );
        } finally {
            setSaving(false);
        }
    };
    if(loading){
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <p className="text-sm text-gray-500">
                    Loading emergency bed information...
                </p>
            </div>
        );
    }
    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-xl font-extrabold text-emerald-900">
                   🛏️ Emergency Bed Management
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                    Manage the emergency beds available at your hospital
                </p>
            </div>
            {error && (
                <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                    {error}
                    </div>
            )}
            {message && (
                <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3">
                    {message}
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <p className="text-sm font-bold text-gray-500">
                        Total Emergency Beds
                    </p>
                <div className="flex items-center gap-3 mt-4">
                    <button
                    type="button"
                    onClick={()=>
                        setEmergencyBeds((value)=>Math.max(0,value-1))
                    }
                    className="w-10 h-10 rounded-lg bg-gray-100 text-xl font-bold hover:g-gray-200">
                        ━
                    </button>
                    <input 
                     type="number"
                     min="0"
                     value={emergencyBeds}
                     onChange={(e)=>
                        setEmergencyBeds(Number(e.target.value))
                     }
                     className="w-24 text-center text-2xl font-extrabold border border-gray-300 rounded-lg py-2"
                     />
                     <button
                      type="button"
                      onClick={()=>
                        setEmergencyBeds((value)=>value+1)
                      }
                      className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 text-xl font-bold hover:bg-emerald-200"
                      >
                        +
                      </button>
                </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <p className="text-sm font-bold text-gray-500">
                        Currently Available Beds
                    </p>
                <div className="flex items-center gap-3 mt-4">
                    <button
                    type="button"
                    onClick={()=>
                        setAvailableEmergencyBeds((value)=>Math.max(0,value-1))
                    }
                    className="w-10 h-10 rounded-lg bg-gray-100 text-xl font-bold hover:g-gray-200">
                        ━
                    </button>
                    <input 
                     type="number"
                     min="0"
                     value={availableEmergencyBeds}
                     onChange={(e)=>
                        setAvailableEmergencyBeds(Number(e.target.value))
                     }
                     className="w-24 text-center text-2xl font-extrabold border border-gray-300 rounded-lg py-2"
                     />
                     <button
                      type="button"
                      onClick={()=>
                        setAvailableEmergencyBeds((value)=>Math.min(emergencyBeds,value+1))
                      }
                      className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 text-xl font-bold hover:bg-emerald-200"
                      >
                        +
                      </button>
                </div>
                </div>
            </div>
             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          <div>
            <p className="font-bold text-gray-800">
              Bed availability
            </p>

            <p className="text-xs text-gray-500 mt-1">
              Available beds cannot exceed the total emergency beds.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl hover:bg-emerald-800 disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>

        </div>
      </div>

        </div>
    );
}