'use client';

import React, { useState, useEffect } from 'react';

export default function ObfuscatedEmail() {
  const [email, setEmail] = useState('');
  
  useEffect(() => {
    // Decodes privacy@norinly.live
    setEmail(atob('cHJpdmFjeUBub3Jpbmx5LmxpdmU='));
  }, []);

  return email ? (
    <a href={`mailto:${email}`} className="text-blue-600 hover:underline">
      {email}
    </a>
  ) : (
    <span className="text-slate-400">Loading email...</span>
  );
}
