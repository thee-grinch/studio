'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/health-chatbot.ts';
import '@/ai/flows/dashboard-tip-flow.ts';
