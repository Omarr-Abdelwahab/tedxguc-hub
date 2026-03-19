import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { orgTree, OrgNode } from "@/data/mockData";

const OrgTreeSection = () => {
  const [selectedNode, setSelectedNode] = useState<OrgNode | null>(null);

  return (
    <section className="py-24 bg-secondary">
      <div className="container mx-auto px-6">
        <div className="mb-16 text-center">
          <p className="text-primary font-semibold tracking-[0.2em] uppercase text-xs mb-3">
            Our People
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
            The Team
          </h2>
        </div>

        {/* Tree */}
        <div className="flex flex-col items-center gap-12">
          {/* Level 1 — Chairman */}
          <TreeNode node={orgTree} onClick={setSelectedNode} />

          {/* Connector */}
          <div className="w-px h-8 bg-border" />

          {/* Level 2 — Curators */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-10 relative">
            {/* Horizontal connector line */}
            <div className="hidden md:block absolute top-0 left-1/4 right-1/4 h-px bg-border" />
            {orgTree.children?.map((curator) => (
              <div key={curator.id} className="flex flex-col items-center gap-6">
                <TreeNode node={curator} onClick={setSelectedNode} />

                {/* Connector to children */}
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
