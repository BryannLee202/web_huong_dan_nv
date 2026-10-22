/**
 * RMSA Knowledge Graph Generator
 * Inspired by Graphify & CodeGraph:
 * Extracts entities, concepts, rules, scenarios, and relationships from:
 * - 8 Training Modules in data/courses.json
 * - Real estate leasing scripts, 72h deposit policy, commission structures, PCCC rules
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const coursesPath = path.join(rootDir, 'data', 'courses.json');
const outputPath = path.join(rootDir, 'data', 'rmsa-knowledge-graph.json');

const courses = JSON.parse(fs.readFileSync(coursesPath, 'utf8'));

// 1. Danh mục các cụm tri thức (Clusters)
const clusters = [
  { id: 'cluster_product', name: 'Sản Phẩm & Định Giá', color: '#0284c7', icon: 'Home' },
  { id: 'cluster_source', name: 'Nguồn Hàng & Chủ Nhà', color: '#10b981', icon: 'Database' },
  { id: 'cluster_marketing', name: 'Tìm Khách & Marketing', color: '#f59e0b', icon: 'Megaphone' },
  { id: 'cluster_consulting', name: 'Tư Vấn & Dẫn Khách', color: '#6366f1', icon: 'Users' },
  { id: 'cluster_closing', name: 'Bẻ Gãy Từ Chối & Chốt Cọc', color: '#ec4899', icon: 'Award' },
  { id: 'cluster_crm', name: 'CRM & Quản Lý Phễu', color: '#8b5cf6', icon: 'BarChart3' },
  { id: 'cluster_legal', name: 'Pháp Lý, Cọc 72h & CSKH', color: '#ef4444', icon: 'ShieldCheck' },
  { id: 'cluster_field', name: 'Thực Chiến Thực Địa & Ca Khó', color: '#14b8a6', icon: 'Compass' }
];

// 2. Khởi tạo danh sách Node và Link
const nodes = [];
const links = [];

// Thêm các node Modules (8 Chuyên đề)
courses.forEach(c => {
  nodes.push({
    id: `course_${c.id}`,
    label: c.title.split(' - ')[0],
    subLabel: c.category,
    fullTitle: c.title,
    type: 'course',
    courseId: c.id,
    order: c.order,
    cluster: `cluster_${c.id === 'bai-1' ? 'product' : c.id === 'bai-2' ? 'source' : c.id === 'bai-3' ? 'marketing' : c.id === 'bai-4' ? 'consulting' : c.id === 'bai-5' ? 'closing' : c.id === 'bai-6' ? 'crm' : c.id === 'bai-7' ? 'legal' : 'field'}`,
    importance: 10,
    summary: c.videos?.[0]?.summary || []
  });
});

// Liên kết tuyến tính giữa 8 bài học (Học theo lộ trình chuẩn)
for (let i = 1; i < courses.length; i++) {
  links.push({
    source: `course_${courses[i - 1].id}`,
    target: `course_${courses[i].id}`,
    relation: 'lộ_trình_tiếp_theo',
    label: 'Bước tiếp theo'
  });
}

// 3. Các thực thể tri thức BĐS chuyên sâu (Concepts & Rules)
const realEstateConcepts = [
  // Cụm 1: Sản phẩm
  {
    id: 'concept_studio',
    label: 'Căn hộ Studio',
    cluster: 'cluster_product',
    type: 'concept',
    definition: 'Không gian mở không vách ngăn giữa phòng ngủ, phòng khách và bếp. Giá thuê 8–12tr (Bình Thạnh), 4–6.5tr (Gò Vấp).',
    courseId: 'bai-1',
    keywords: ['studio', 'không vách ngăn', 'chdv']
  },
  {
    id: 'concept_duplex',
    label: 'Căn hộ Duplex (Gác lửng)',
    cluster: 'cluster_product',
    type: 'concept',
    definition: 'Không gian bố trí trên hai tầng kết nối bằng cầu thang nội bộ, thông tầng thoáng đãng.',
    courseId: 'bai-1',
    keywords: ['duplex', 'gác lửng', 'thông tầng']
  },
  {
    id: 'concept_total_cost',
    label: 'Công thức Tổng Chi Phí Tháng',
    cluster: 'cluster_product',
    type: 'rule',
    definition: 'Tổng chi phí = Giá thuê + Điện (theo đồng hồ) + Nước/người + Gửi xe + Phí dịch vụ. Phải báo trước khi dẫn khách.',
    courseId: 'bai-1',
    keywords: ['tổng chi phí', 'điện nước', 'phí quản lý', 'minh bạch']
  },
  {
    id: 'concept_pccc_6_points',
    label: '6 Tiêu Chuẩn An Toàn PCCC',
    cluster: 'cluster_product',
    type: 'rule',
    definition: 'Thang thoát hiểm, bình cứu hỏa hạn mới, chuông báo khói, lối thoát nạn ban công, cửa chống cháy, khóa vân tay thoát hiểm.',
    courseId: 'bai-1',
    keywords: ['pccc', 'an toàn', 'thoát hiểm', 'bình bọt']
  },

  // Cụm 2: Nguồn hàng
  {
    id: 'concept_gio_hang_trong',
    label: 'Giỏ Căn Hộ Trống Thực Tế',
    cluster: 'cluster_source',
    type: 'concept',
    definition: 'Danh sách phòng trống được cập nhật hàng ngày trước 9h00 sáng trực tiếp với chủ nhà hoặc quản lý tòa nhà.',
    courseId: 'bai-2',
    keywords: ['giỏ hàng', 'phòng trống', 'chủ nhà', 'cập nhật 9h']
  },
  {
    id: 'concept_ky_gui_nha',
    label: 'Khai Thác Ký Gửi Chủ Nhà',
    cluster: 'cluster_source',
    type: 'skill',
    definition: 'Kỹ năng thiết lập quan hệ độc quyền hoặc ưu tiên đẩy phòng với chủ nhà thông qua cam kết thời gian lấp đầy phòng.',
    courseId: 'bai-2',
    keywords: ['ký gửi', 'chủ nhà', 'độc quyền', 'hoa hồng']
  },

  // Cụm 3: Tìm khách & Marketing
  {
    id: 'concept_chotot_strategy',
    label: 'Chiến Lược Đăng Tin Chợ Tốt',
    cluster: 'cluster_marketing',
    type: 'skill',
    definition: 'Đăng tin khung giờ vàng (11h-13h & 19h-21h), tiêu đề giật tít chuẩn vị trí (gần ĐH/quận 1), hình ảnh thật góc rộng.',
    courseId: 'bai-3',
    keywords: ['chợ tốt', 'đăng tin', 'khung giờ vàng', 'lead']
  },
  {
    id: 'concept_telesale_2min',
    label: 'Kịch Bản Khai Thác Nhu Cầu 2 Phút',
    cluster: 'cluster_marketing',
    type: 'skill',
    definition: 'Hỏi 4 điểm then chốt: Ngân sách trọn gói, số người ở, phương tiện di chuyển, ngày dự kiến dọn vào.',
    courseId: 'bai-3',
    keywords: ['2 phút', 'khai thác nhu cầu', 'telesale', 'ngân sách']
  },

  // Cụm 4: Tư vấn & Dẫn khách
  {
    id: 'concept_checklist_dan_khach',
    label: 'Checklist Đón Khách Xem Phòng',
    cluster: 'cluster_consulting',
    type: 'skill',
    definition: 'Đến trước 15 phút, bật điều hòa mát trước, mở rèm ánh sáng tự nhiên, xịt khử mùi thơm dịu, chuẩn bị sẵn dép trong nhà.',
    courseId: 'bai-4',
    keywords: ['đón khách', 'check in', 'bật máy lạnh', 'trải nghiệm']
  },
  {
    id: 'concept_loi_the_vi_tri',
    label: 'Kỹ Thuật Bán Vị Trí & Tiện Ích Vùng',
    cluster: 'cluster_consulting',
    type: 'skill',
    definition: 'Bán khoảng cách di chuyển đến chỗ làm/trường học thay vì chỉ nói số km; chỉ rõ chợ, siêu thị, phòng gym bán kính 500m.',
    courseId: 'bai-4',
    keywords: ['bán vị trí', 'tiện ích', 'khoảng cách', 'thời gian']
  },

  // Cụm 5: Chốt cọc & Bẻ gãy từ chối
  {
    id: 'concept_be_gay_tu_choi_gia',
    label: 'Bẻ Gãy Từ Chối: "Giá Này Hơi Đắt"',
    cluster: 'cluster_closing',
    type: 'scenario',
    definition: 'Tách nhỏ chi phí theo ngày (chỉ chênh 20k/ngày), so sánh với chi phí xăng xe và sức khỏe khi ở xa, làm nổi bật nội thất sẵn có.',
    courseId: 'bai-5',
    keywords: ['từ chối giá', 'đắt quá', 'chia nhỏ chi phí', 'giá trị']
  },
  {
    id: 'concept_chot_coc_tai_cho',
    label: 'Kỹ Thuật Chốt Giữ Phòng Tại Chỗ',
    cluster: 'cluster_closing',
    type: 'skill',
    definition: 'Tạo tính khan hiếm có thật: Cho khách xem tin nhắn có 2 khách khác đang hẹn xem buổi chiều; hướng dẫn cọc giữ quyền thuê 72h.',
    courseId: 'bai-5',
    keywords: ['chốt cọc', 'khan hiếm', 'giữ phòng', 'đặt cọc ngay']
  },

  // Cụm 6: CRM & Phễu chuyển đổi
  {
    id: 'concept_phee_chuyen_doi',
    label: 'Phễu Chuyển Đổi Thực Chiến RMSA',
    cluster: 'cluster_crm',
    type: 'concept',
    definition: 'Tỷ lệ vàng: 100 Khách xem tin -> 20 Khách nhắn tin/gọi -> 8 Khách hẹn xem phòng -> 2-3 Khách chốt cọc.',
    courseId: 'bai-6',
    keywords: ['phễu', 'crm', 'tỷ lệ chuyển đổi', 'kpi']
  },
  {
    id: 'concept_ky_luat_follow_up',
    label: 'Kỷ Luật Follow-Up Sau Khi Xem Phòng',
    cluster: 'cluster_crm',
    type: 'rule',
    definition: 'Gửi video tóm tắt lại phòng sau 30 phút; gọi lại sau 2 giờ thăm dò quyết định; không để khách nguội quá 24h.',
    courseId: 'bai-6',
    keywords: ['follow up', 'chăm sóc', 'nhắc hẹn', 'sau xem phòng']
  },

  // Cụm 7: Pháp lý & Giữ cọc 72h
  {
    id: 'concept_quy_chuan_coc_72h',
    label: 'Quy Chuẩn Giữ Cọc Phòng 72 Giờ',
    cluster: 'cluster_legal',
    type: 'rule',
    definition: 'Cam kết bằng văn bản: Chủ nhà khóa phòng không nhận khách khác trong 72h để khách chuẩn bị tiền ký hợp đồng chính thức.',
    courseId: 'bai-7',
    keywords: ['cọc 72h', 'giữ cọc', 'khóa phòng', 'cam kết']
  },
  {
    id: 'concept_hop_dong_coc_chuan',
    label: 'Hợp Đồng Đặt Cọc Bảo Vệ 3 Bên',
    cluster: 'cluster_legal',
    type: 'rule',
    definition: 'Ghi rõ số tiền cọc, ngày bàn giao, hiện trạng nội thất, điều kiện hoàn cọc (nếu chủ nhà đổi ý phạt cọc gấp đôi).',
    courseId: 'bai-7',
    keywords: ['hợp đồng cọc', 'phạt cọc', 'bảo vệ cọc', 'pháp lý']
  },
  {
    id: 'concept_ban_giao_phong',
    label: 'Biên Bản Bàn Giao Hiện Trạng 12 Điểm',
    cluster: 'cluster_legal',
    type: 'rule',
    definition: 'Chụp ảnh chỉ số công tơ điện nước, kiểm tra máy lạnh làm mát, máy giặt, tủ lạnh, thoát sàn vệ sinh, remote cửa cuốn.',
    courseId: 'bai-7',
    keywords: ['bàn giao', 'chỉ số điện', 'biên bản', 'hiện trạng']
  },

  // Cụm 8: Thực chiến thị trường
  {
    id: 'concept_khao_sat_thuc_dia',
    label: 'Bản Đồ Nóng Khảo Sát Thực Địa',
    cluster: 'cluster_field',
    type: 'skill',
    definition: 'Thực địa trực tiếp từng hẻm xe hơi, kiểm tra ngập nước mùa mưa, an ninh đêm, tiếng ồn quán nhậu lân cận.',
    courseId: 'bai-8',
    keywords: ['thực địa', 'ngập nước', 'an ninh', 'khảo sát']
  },
  {
    id: 'concept_xu_ly_khach_doi_coc',
    label: 'Xử Lý Ca Khó: Khách Đột Ngột Đòi Hủy Cọc',
    cluster: 'cluster_field',
    type: 'scenario',
    definition: 'Lắng nghe lý do thật sự (đổi chỗ làm/chê ồn). Nếu trong 24h: hỗ trợ điều chuyển cọc sang căn khác trong cùng hệ thống chủ nhà.',
    courseId: 'bai-8',
    keywords: ['hủy cọc', 'đòi lại cọc', 'điều chuyển cọc', 'xử lý ca khó']
  }
];

// Thêm concepts vào danh sách nodes
nodes.push(...realEstateConcepts);

// 4. Thiết lập liên kết thông minh giữa các khái niệm (Edges)
realEstateConcepts.forEach(concept => {
  // Liên kết Concept -> Course tương ứng
  links.push({
    source: `course_${concept.courseId}`,
    target: concept.id,
    relation: 'thuộc_chuyên_đề',
    label: 'Nội dung cốt lõi'
  });
});

// Liên kết ngữ nghĩa chéo (Cross-cutting Knowledge Edges)
const crossLinks = [
  { source: 'concept_studio', target: 'concept_total_cost', relation: 'phải_áp_dụng', label: 'Báo tổng chi phí' },
  { source: 'concept_duplex', target: 'concept_total_cost', relation: 'phải_áp_dụng', label: 'Báo tổng chi phí' },
  { source: 'concept_gio_hang_trong', target: 'concept_chotot_strategy', relation: 'cung_cấp_dữ_liệu', label: 'Lấy căn trống đăng tin' },
  { source: 'concept_chotot_strategy', target: 'concept_telesale_2min', relation: 'chuyển_giao_khách', label: 'Khách nhắn -> Gọi ngay' },
  { source: 'concept_telesale_2min', target: 'concept_checklist_dan_khach', relation: 'thiết_lập_lịch_hẹn', label: 'Chốt giờ xem phòng' },
  { source: 'concept_checklist_dan_khach', target: 'concept_loi_the_vi_tri', relation: 'phối_hợp', label: 'Chỉ tiện ích xung quanh' },
  { source: 'concept_loi_the_vi_tri', target: 'concept_be_gay_tu_choi_gia', relation: 'dẫn_tới', label: 'Xử lý khi khách chê đắt' },
  { source: 'concept_be_gay_tu_choi_gia', target: 'concept_chot_coc_tai_cho', relation: 'tiến_tới_chốt', label: 'Khách ưng ý -> Cọc giữ phòng' },
  { source: 'concept_chot_coc_tai_cho', target: 'concept_quy_chuan_coc_72h', relation: 'quy_chuẩn_bắt_buộc', label: 'Bảo vệ quyền lợi 72h' },
  { source: 'concept_quy_chuan_coc_72h', target: 'concept_hop_dong_coc_chuan', relation: 'văn_bản_hóa', label: 'Ký hợp đồng cọc' },
  { source: 'concept_hop_dong_coc_chuan', target: 'concept_ban_giao_phong', relation: 'nghiệm_thu', label: 'Bàn giao chìa khóa' },
  { source: 'concept_ban_giao_phong', target: 'concept_ky_luat_follow_up', relation: 'chăm_sóc_tiếp', label: 'Hỏi thăm sau 3 ngày' },
  { source: 'concept_xu_ly_khach_doi_coc', target: 'concept_quy_chuan_coc_72h', relation: 'căn_cứ_pháp_lý', label: 'Dựa vào thỏa thuận 72h' },
  { source: 'concept_pccc_6_points', target: 'concept_checklist_dan_khach', relation: 'chỉ_cho_khách', label: 'Chỉ lối thoát hiểm khi xem phòng' }
];

crossLinks.forEach(l => {
  links.push({
    source: l.source,
    target: l.target,
    relation: l.relation,
    label: l.label
  });
});

const knowledgeGraph = {
  metadata: {
    title: 'RMSA Real Estate Knowledge Graph',
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    totalNodes: nodes.length,
    totalLinks: links.length,
    clustersCount: clusters.length
  },
  clusters,
  nodes,
  links
};

fs.writeFileSync(outputPath, JSON.stringify(knowledgeGraph, null, 2), 'utf8');
console.log(`✅ Đã khởi tạo thành công RMSA Knowledge Graph với ${nodes.length} nodes và ${links.length} links!`);
