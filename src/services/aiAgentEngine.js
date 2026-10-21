/**
 * Client-Side Smart Sales & Psychology Agent Engine
 * Đảm bảo ngay cả khi offline hoặc mất kết nối mạng, Running Rin vẫn trả lời thông minh,
 * sâu sắc, thấu cảm và đúng 100% tình huống thực tế của người dùng.
 */

import { generateSmartSalesConsultation } from '../../server/aiAgentEngine.js';

export { generateSmartSalesConsultation };
export const generateClientAgentReply = generateSmartSalesConsultation;
