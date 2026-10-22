import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Search, 
  Share2, 
  Network, 
  BookOpen, 
  ShieldCheck, 
  Award, 
  Home, 
  Database, 
  Users, 
  Megaphone, 
  BarChart3, 
  Compass, 
  ArrowRight, 
  ExternalLink,
  Sparkles,
  Info,
  CheckCircle2
} from 'lucide-react';
import api from '../services/api';

const CLUSTER_ICONS = {
  cluster_product: Home,
  cluster_source: Database,
  cluster_marketing: Megaphone,
  cluster_consulting: Users,
  cluster_closing: Award,
  cluster_crm: BarChart3,
  cluster_legal: ShieldCheck,
  cluster_field: Compass
};

export default function KnowledgeGraphModal({ 
  isOpen = false, 
  onClose = () => {}, 
  onSelectCourse = null 
}) {
  const [graphData, setGraphData] = useState({ clusters: [], nodes: [], links: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [activeCluster, setActiveCluster] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Tải dữ liệu đồ thị tri thức từ Backend
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    async function fetchGraph() {
      setIsLoading(true);
      try {
        const res = await api.knowledgeGraph.getFullGraph();
        if (isMounted && res && res.success && res.graph) {
          setGraphData(res.graph);
          if (res.graph.nodes && res.graph.nodes.length > 0) {
            setSelectedNode(res.graph.nodes[0]);
          }
        }
      } catch (err) {
        console.warn('Lỗi nạp đồ thị tri thức:', err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    fetchGraph();
    return () => { isMounted = false; };
  }, [isOpen]);

  // Lọc nodes theo cluster và search query
  const filteredNodes = useMemo(() => {
    let list = graphData.nodes || [];
    if (activeCluster !== 'all') {
      list = list.filter(n => n.cluster === activeCluster);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(n => 
        (n.label && n.label.toLowerCase().includes(q)) ||
        (n.definition && n.definition.toLowerCase().includes(q)) ||
        (n.fullTitle && n.fullTitle.toLowerCase().includes(q)) ||
        (n.keywords && n.keywords.some(k => k.toLowerCase().includes(q)))
      );
    }
    return list;
  }, [graphData.nodes, activeCluster, searchQuery]);

  // Tìm các nodes và links liên quan trực tiếp đến selectedNode
  const connectedInfo = useMemo(() => {
    if (!selectedNode || !Array.isArray(graphData.links)) return { inbound: [], outbound: [] };

    const outbound = [];
    const inbound = [];

    const nodeMap = new Map((graphData.nodes || []).map(n => [n.id, n]));

    graphData.links.forEach(link => {
      if (link.source === selectedNode.id) {
        const targetNode = nodeMap.get(link.target);
        if (targetNode) {
          outbound.push({ node: targetNode, label: link.label || link.relation });
        }
      } else if (link.target === selectedNode.id) {
        const sourceNode = nodeMap.get(link.source);
        if (sourceNode) {
          inbound.push({ node: sourceNode, label: link.label || link.relation });
        }
      }
    });

    return { inbound, outbound };
  }, [selectedNode, graphData.links, graphData.nodes]);

  if (!isOpen) return null;

  const modalContent = (
    <div data-modal-portal="true" className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200 select-none">
      <div 
        className="relative w-full max-w-6xl h-[92vh] max-h-[860px] rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. Header: Tiêu chuẩn cao cấp chuẩn Graphify & CodeGraph */}
        <div className="px-5 py-3.5 bg-slate-50/90 dark:bg-slate-850/90 border-b border-slate-200/70 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                  RMSA Knowledge Graph
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 text-[10px] font-extrabold border border-cyan-300/40">
                  CodeGraph & Graphify Engine
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Sơ đồ mạng lưới tri thức thực chiến 8 Chuyên đề BĐS Cho Thuê • {graphData.nodes?.length || 0} Thực thể • {graphData.links?.length || 0} Mối quan hệ
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-200/70 dark:bg-slate-800 hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-950/60 dark:hover:text-rose-400 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
            title="Đóng sơ đồ"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2. Thanh tìm kiếm và Tabs cụm chủ đề (Clusters) */}
        <div className="px-5 py-2.5 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 shrink-0">
          <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-0.5">
            <button
              type="button"
              onClick={() => setActiveCluster('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                activeCluster === 'all'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              Tất cả ({graphData.nodes?.length || 0})
            </button>
            {(graphData.clusters || []).map(cluster => {
              const IconComp = CLUSTER_ICONS[cluster.id] || BookOpen;
              const count = (graphData.nodes || []).filter(n => n.cluster === cluster.id).length;
              return (
                <button
                  key={cluster.id}
                  type="button"
                  onClick={() => setActiveCluster(cluster.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                    activeCluster === cluster.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  <span>{cluster.name}</span>
                  <span className="opacity-70 text-[10px]">({count})</span>
                </button>
              );
            })}
          </div>

          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Tìm tri thức (cọc, studio, duplex, giá...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-7 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
            />
            {searchQuery && (
              <button 
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* 3. Thân sơ đồ: Chia 2 cột (Danh sách Nodes đồ thị bên trái + Chi tiết liên kết bên phải) */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
          
          {/* Cột trái: Lưới các Node đồ thị tri thức */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 bg-slate-50/50 dark:bg-slate-950/40">
            {isLoading ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                Đang nạp mạng lưới đồ thị tri thức...
              </div>
            ) : filteredNodes.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400">
                <Network className="w-10 h-10 mb-2 opacity-30 text-slate-400" />
                <p className="text-xs font-semibold">Không tìm thấy khái niệm nào phù hợp</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredNodes.map(node => {
                  const isSelected = selectedNode?.id === node.id;
                  const clusterObj = (graphData.clusters || []).find(c => c.id === node.cluster);
                  const IconComp = CLUSTER_ICONS[node.cluster] || BookOpen;

                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedNode(node)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group active:scale-[0.98] ${
                        isSelected
                          ? 'bg-blue-50/90 dark:bg-blue-950/50 border-blue-500 ring-2 ring-blue-500/20 shadow-md'
                          : 'bg-white dark:bg-slate-800/90 hover:bg-slate-50 dark:hover:bg-slate-750 border-slate-200/80 dark:border-slate-700/80 shadow-2xs'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1.5">
                          <span 
                            className="px-2 py-0.5 rounded-lg text-[9.5px] font-black uppercase tracking-wider flex items-center space-x-1"
                            style={{ 
                              backgroundColor: clusterObj ? `${clusterObj.color}20` : '#e2e8f0',
                              color: clusterObj ? clusterObj.color : '#475569'
                            }}
                          >
                            <IconComp className="w-2.5 h-2.5" />
                            <span>{node.type}</span>
                          </span>

                          {node.courseId && (
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                              {node.courseId.replace('bai-', 'Bài ')}
                            </span>
                          )}
                        </div>

                        <h4 className="text-xs font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                          {node.label}
                        </h4>

                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                          {node.definition || node.fullTitle || (node.summary && node.summary[0]) || ''}
                        </p>
                      </div>

                      {/* Footer thẻ node */}
                      <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between text-[10px] text-slate-400">
                        <span className="truncate max-w-[70%]">
                          {clusterObj?.name || 'Tri thức'}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Cột phải: Khối Thông Tin Chi Tiết Node & Các Liên Kết Ngữ Nghĩa */}
          <div className="w-full md:w-80 lg:w-96 border-t md:border-t-0 md:border-l border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 flex flex-col justify-between overflow-y-auto shrink-0">
            {selectedNode ? (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center space-x-1.5 mb-2">
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-black uppercase">
                      Node: {selectedNode.type}
                    </span>
                    {selectedNode.courseId && (
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-extrabold">
                        {selectedNode.courseId.replace('bai-', 'Chuyên đề ')}
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-snug">
                    {selectedNode.fullTitle || selectedNode.label}
                  </h3>
                </div>

                {/* Định nghĩa / Mô tả thực tế */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                  <div className="flex items-center space-x-1 font-bold text-slate-900 dark:text-white mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Ý nghĩa thực chiến:</span>
                  </div>
                  <p>{selectedNode.definition || (selectedNode.summary && selectedNode.summary.join(' ')) || 'Khái niệm cốt lõi trong lộ trình đào tạo RMSA.'}</p>
                </div>

                {/* Từ khóa kích hoạt */}
                {selectedNode.keywords && selectedNode.keywords.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                      Từ khóa ngữ nghĩa:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {selectedNode.keywords.map(kw => (
                        <span key={kw} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-mono">
                          #{kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mối quan hệ liên kết (Inbound & Outbound) */}
                <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Mối liên hệ trong đồ thị tri thức:
                  </span>

                  {connectedInfo.outbound.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 flex items-center space-x-1">
                        <span>➔ Dẫn tới / Cần cho:</span>
                      </span>
                      {connectedInfo.outbound.map(({ node, label }) => (
                        <button
                          key={node.id}
                          type="button"
                          onClick={() => setSelectedNode(node)}
                          className="w-full text-left p-2 rounded-xl bg-slate-50 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-slate-750 border border-slate-200/60 dark:border-slate-700 transition-colors flex items-center justify-between text-xs cursor-pointer group"
                        >
                          <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 truncate">
                            {node.label}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono shrink-0 pl-1">
                            {label}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {connectedInfo.inbound.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
                        <span>⬅ Bắt nguồn từ:</span>
                      </span>
                      {connectedInfo.inbound.map(({ node, label }) => (
                        <button
                          key={node.id}
                          type="button"
                          onClick={() => setSelectedNode(node)}
                          className="w-full text-left p-2 rounded-xl bg-slate-50 hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-slate-750 border border-slate-200/60 dark:border-slate-700 transition-colors flex items-center justify-between text-xs cursor-pointer group"
                        >
                          <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 truncate">
                            {node.label}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono shrink-0 pl-1">
                            {label}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                Chọn một khái niệm trên sơ đồ để xem liên kết
              </div>
            )}

            {/* Nút hành động trực tiếp: Đi tới bài học */}
            {selectedNode?.courseId && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    if (onSelectCourse) {
                      onSelectCourse(selectedNode.courseId);
                    }
                    onClose();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center justify-center space-x-1.5 transition-all cursor-pointer active:scale-95"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Vào học chuyên đề {selectedNode.courseId.replace('bai-', '')} ngay</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-1" />
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
}
