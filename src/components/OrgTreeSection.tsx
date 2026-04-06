import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { orgTreesBySeason, OrgNode } from "@/data/mockData";

const seasons = Object.keys(orgTreesBySeason).sort((a, b) => Number(b) - Number(a));

const OrgTreeSection = () => {
  const [selectedSeason, setSelectedSeason] = useState(seasons[0]);
  const [selectedNode, setSelectedNode] = useState<OrgNode | null>(null);

  const tree = orgTreesBySeason[selectedSeason];

  return (
    <section className="py-24 bg-secondary">
      <div className="container mx-auto px-6">
        <div className="mb-16 text-center">
          <p className="text-primary font-semibold tracking-[0.2em] uppercase text-xs mb-3">
            Our People
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight mb-8">
            The Team
          </h2>

          {/* Season toggle */}
          <div className="flex gap-3 justify-center">
            {seasons.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSeason(s)}
                className={`px-5 py-2 text-sm font-semibold uppercase tracking-wider transition-colors ${
                  selectedSeason === s
                    ? "bg-primary text-primary-foreground"
                    : "bg-background border-2 border-border text-foreground hover:text-primary hover:border-primary"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Tree */}
        <div className="flex flex-col items-center gap-12">
          {/* Level 1 — Chairman */}
          <TreeNode node={tree} onClick={setSelectedNode} />

          {/* Connector */}
          <div className="w-px h-8 bg-border" />

          {/* Level 2 — Curators */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8 w-full max-w-5xl relative">
            <div className="hidden md:block absolute top-0 left-1/4 right-1/4 h-px bg-border" />
            {tree.children?.map((curator) => (
              <div key={curator.id} className="flex flex-col items-center gap-6">
                <TreeNode node={curator} onClick={setSelectedNode} />

                {curator.children && curator.children.length > 0 && (
                  <>
                    <div className="w-px h-6 bg-border" />
                    <div className="flex flex-wrap justify-center gap-4">
                      {curator.children.map((exec) => (
                        <TreeNode
                          key={exec.id}
                          node={exec}
                          onClick={setSelectedNode}
                          small
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detail Panel */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-accent/80 backdrop-blur-sm flex items-center justify-end"
            onClick={() => setSelectedNode(null)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="h-full w-full max-w-md bg-background border-l border-border p-8 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedNode(null)}
                className="mb-8 text-muted-foreground hover:text-primary transition-colors"
              >
                <X size={24} />
              </button>

              <p className="text-primary font-semibold text-xs uppercase tracking-[0.2em] mb-2">
                {selectedNode.level === 1
                  ? "Chairman"
                  : selectedNode.level === 2
                  ? "Curator"
                  : "Executive Committee"}
              </p>
              <h3 className="text-3xl font-black text-foreground mb-2">
                {selectedNode.title}
              </h3>
              <p className="text-lg font-medium text-muted-foreground mb-6">
                {selectedNode.name}
              </p>
              <div className="w-12 h-1 bg-primary mb-6" />
              <p className="text-foreground/70 leading-relaxed">
                {selectedNode.description}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

interface TreeNodeProps {
  node: OrgNode;
  onClick: (node: OrgNode) => void;
  small?: boolean;
}

const TreeNode = ({ node, onClick, small }: TreeNodeProps) => {
  return (
    <button
      onClick={() => onClick(node)}
      className={`group border-2 border-border bg-background transition-all duration-300 hover:border-primary hover:shadow-lg hover:shadow-primary/10 text-left ${
        small ? "px-4 py-3 min-w-[140px]" : "px-6 py-5 min-w-[200px]"
      }`}
    >
      <p
        className={`font-bold text-foreground group-hover:text-primary transition-colors ${
          small ? "text-xs" : "text-sm"
        }`}
      >
        {node.title}
      </p>
      <p
        className={`text-muted-foreground mt-0.5 ${
          small ? "text-[10px]" : "text-xs"
        }`}
      >
        {node.name}
      </p>
    </button>
  );
};

export default OrgTreeSection;
