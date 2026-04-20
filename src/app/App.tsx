import { useState, useEffect } from 'react';
import { Smartphone, Download, ShieldCheck, Zap, Loader, Search } from 'lucide-react';
import { projectId, publicAnonKey } from "/utils/supabase/info";

interface AppItem {
  id: string;
  title: string;
  description: string;
  version: string;
  platform: string;
  category: string;
  download