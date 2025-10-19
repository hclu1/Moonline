import React from 'react'
import { useConfigStore } from '../store/configStore'

export const DebugConfig: React.FC = () => {
  const { config, currentUser, isAdmin, error } = useConfigStore()
  
  return (
    <div className="fixed bottom-4 right-4 bg-slate-800 border border-purple-500 rounded-lg p-4 max-w-md text-xs text-white z-50 shadow-xl">
      <h3 className="font-bold mb-2 text-purple-400">🔍 Debug Configuration</h3>
      
      <div className="space-y-1">
        <div>
          <span className="text-gray-400">👤 User:</span>{' '}
          <span className={currentUser ? 'text-green-400' : 'text-red-400'}>
            {currentUser?.email || 'Non connecté'}
          </span>
        </div>
        
        <div>
          <span className="text-gray-400">🔐 Admin:</span>{' '}
          <span className={isAdmin ? 'text-green-400' : 'text-red-400'}>
            {isAdmin ? 'Oui' : 'Non'}
          </span>
        </div>
        
        <div>
          <span className="text-gray-400">📋 Config ID:</span>{' '}
          <span className="text-blue-400">{config?.id || 'Aucune'}</span>
        </div>
        
        <div>
          <span className="text-gray-400">🎨 Couleur primaire:</span>{' '}
          <span style={{ color: config?.primary_color }}>
            {config?.primary_color || 'N/A'}
          </span>
        </div>
        
        {error && (
          <div className="text-red-400">
            <span className="text-gray-400">❌ Erreur:</span> {error}
          </div>
        )}
        
        <div className="mt-2 pt-2 border-t border-gray-700">
          <span className="text-gray-400">💾 Cache local:</span>{' '}
          <span className="text-green-400">
            {localStorage.getItem('moonline_config_cache') ? 'Présent' : 'Absent'}
          </span>
        </div>
      </div>
    </div>
  )
}