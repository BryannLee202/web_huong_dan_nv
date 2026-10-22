/**
 * RMSA Knowledge Graph Query & Graph-RAG Engine
 * Inspired by Graphify & CodeGraph:
 * Provides semantic graph search, subgraph traversal, and Graph-RAG prompt augmentation.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const graphFilePath = path.join(rootDir, 'data', 'rmsa-knowledge-graph.json');

let cachedGraph = null;
let nodeMap = new Map();
let linkMap = new Map();

export function loadKnowledgeGraph() {
  try {
    if (!cachedGraph && fs.existsSync(graphFilePath)) {
      const raw = fs.readFileSync(graphFilePath, 'utf8');
      cachedGraph = JSON.parse(raw);
      nodeMap = new Map((cachedGraph.nodes || []).map(n => [n.id, n]));
      
      linkMap = new Map();
      (cachedGraph.links || []).forEach(link => {
        if (!linkMap.has(link.source)) linkMap.set(link.source, []);
        if (!linkMap.has(link.target)) linkMap.set(link.target, []);
        linkMap.get(link.source).push(link);
        linkMap.get(link.target).push(link);
      });
    }
    return cachedGraph;
  } catch (err) {
    console.error('Lỗi nạp RMSA Knowledge Graph:', err.message);
    return { nodes: [], links: [], clusters: [] };
  }
}

/**
 * Tìm kiếm các Node và Subgraph liên quan nhất dựa trên truy vấn văn bản
 */
export function queryKnowledgeGraph(queryString = '', maxNodes = 5) {
  const graph = loadKnowledgeGraph();
  if (!graph || !Array.isArray(graph.nodes) || graph.nodes.length === 0) {
    return { matchedNodes: [], links: [], promptContext: '' };
  }

  const query = String(queryString || '').toLowerCase().trim();
  if (!query) {
    return {
      matchedNodes: graph.nodes.slice(0, maxNodes),
      links: [],
      promptContext: ''
    };
  }

  const queryWords = query.split(/\s+/).filter(w => w.length > 1);

  // Chấm điểm mức độ phù hợp của từng node
  const scoredNodes = graph.nodes.map(node => {
    let score = 0;
    const labelLower = (node.label || '').toLowerCase();
    const defLower = (node.definition || '').toLowerCase();
    const keywords = (node.keywords || []).map(k => String(k).toLowerCase());

    // Khớp chính xác cụm từ
    if (labelLower.includes(query)) score += 30;
    if (defLower.includes(query)) score += 15;

    // Khớp từ khóa
    keywords.forEach(k => {
      if (query.includes(k) || k.includes(query)) score += 20;
    });

    // Khớp từng từ
    queryWords.forEach(w => {
      if (labelLower.includes(w)) score += 6;
      if (defLower.includes(w)) score += 3;
      keywords.forEach(k => {
        if (k.includes(w)) score += 4;
      });
    });

    return { node, score };
  });

  scoredNodes.sort((a, b) => b.score - a.score);
  const matched = scoredNodes.filter(s => s.score > 0).slice(0, maxNodes).map(s => s.node);

  if (matched.length === 0) {
    return { matchedNodes: [], links: [], promptContext: '' };
  }

  // Thu thập các liên kết trực tiếp (1-hop)
  const matchedIds = new Set(matched.map(n => n.id));
  const relevantLinks = (graph.links || []).filter(l => 
    matchedIds.has(l.source) || matchedIds.has(l.target)
  );

  // Sinh văn bản ngữ cảnh Graph RAG cho LLM
  const contextLines = [
    '=== KIẾN THỨC BẤT ĐỘNG SẢN THỰC CHIẾN TỪ RMSA KNOWLEDGE GRAPH ==='
  ];

  matched.forEach(n => {
    contextLines.push(`• [${n.type.toUpperCase()}] ${n.label}: ${n.definition || n.fullTitle || ''}`);
    if (n.courseId) {
      contextLines.push(`  -> Thuộc chuyên đề: ${n.courseId.replace('bai-', 'Bài ')}`);
    }
  });

  relevantLinks.slice(0, 8).forEach(l => {
    const sNode = nodeMap.get(l.source);
    const tNode = nodeMap.get(l.target);
    if (sNode && tNode) {
      contextLines.push(`• Mối quan hệ: [${sNode.label}] --(${l.label || l.relation})--> [${tNode.label}]`);
    }
  });

  return {
    matchedNodes: matched,
    links: relevantLinks.slice(0, 10),
    promptContext: contextLines.join('\n')
  };
}
