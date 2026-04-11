import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { orgTreesBySeason, OrgNode } from "@/data/mockData";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const seasons = Object.keys(orgTreesBySeason).sort((a, b) => Number(b) - Number(a));

// Flatten tree to find all nodes
const flattenTree = (node: OrgNode): OrgNode[] => {
  const children = node.children?.flatMap(flattenTree) ?? [];
  return [node, ...children];
};

const OrgTreeSection = () => {
  const [selectedSeason, setSelectedSeason] = useState(seasons[0]);
  const [selectedNode, setSelectedNode] = useState<OrgNode | null>(null);

  const tree = orgTreesBySeason[selectedSeason];

  // Default to chairman on season change
  useEffect(() => {
    setSelectedNode(tree);
  }, [selectedSeason]);

  // Set initial selection
  useEffect(() => {
    setSelectedNode(tree);
  }, []);

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

        {/* Master-Detail Layout */}
        <div className="flex flex-col xl:flex-row gap-12 xl:gap-16 items-start">
          {/* MASTER: The Tree */}
          <div className="flex-1 w-full">
            <div className="flex flex-col items-center gap-10">
              {/* Level 1 — Chairman */}
              <AvatarNode
                node={tree}
                isSelected={selectedNode?.id === tree.id}
                onClick={setSelectedNode}
                size="lg"
              />

              {/* Connector line */}
              <div className="w-px h-6 bg-border" />

              {/* Level 2 — Curators + Level 3 */}
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-x-6 gap-y-10 w-full max-w-4xl">
                {tree.children?.map((curator) => (
                  <div key={curator.id} className="flex flex-col items-center gap-6">
                    <AvatarNode
                      node={curator}
                      isSelected={selectedNode?.id === curator.id}
                      onClick={setSelectedNode}
                    />

                    {curator.children && curator.children.length > 0 && (
                      <>
                        <div className="w-px h-4 bg-border" />
                        <div className="flex flex-col items-center gap-4">
                          {curator.children.map((exec) => (
                            <AvatarNode
                              key={exec.id}
                              node={exec}
                              isSelected={selectedNode?.id === exec.id}
                              onClick={setSelectedNode}
                              size="sm"
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

          {/* DETAIL: Committee Spotlight */}
          <div className="w-full xl:w-[420px] xl:sticky xl:top-28 shrink-0">
            <AnimatePresence mode="wait">
              {selectedNode && (
                <motion.div
                  key={selectedNode.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="bg-background border border-border p-8 space-y-6"
                >
                  <p className="text-primary font-semibold text-[11px] uppercase tracking-[0.2em]">
                    Committee Spotlight
                  </p>

                  {/* Photo + Name */}
                  <div className="flex items-center gap-5">
                    <Avatar className="h-20 w-20 border-2 border-primary">
                      <AvatarImage src={selectedNode.imageUrl} alt={selectedNode.name} />
                      <AvatarFallback className="text-lg font-bold bg-muted text-muted-foreground">
                        {selectedNode.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-black text-foreground leading-tight">
                        {selectedNode.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {selectedNode.title}
                      </p>
                    </div>
                  </div>

                  <div className="w-full h-px bg-border" />

                  {/* Committee description */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-2">
                      About the Committee
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {selectedNode.committeeDescription}
                    </p>
                  </div>

                  {/* Member bio */}
                  {selectedNode.memberBio && (
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-2">
                        About {selectedNode.name.split(" ")[0]}
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {selectedNode.memberBio}
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

interface AvatarNodeProps {
  node: OrgNode;
  isSelected: boolean;
  onClick: (node: OrgNode) => void;
  size?: "sm" | "md" | "lg";
}

const AvatarNode = ({ node, isSelected, onClick, size = "md" }: AvatarNodeProps) => {
  const avatarSize = size === "lg" ? "h-20 w-20" : size === "sm" ? "h-12 w-12" : "h-16 w-16";
  const textSize = size === "sm" ? "text-[10px]" : "text-xs";
  const nameSize = size === "sm" ? "text-[9px]" : "text-[11px]";

  return (
    <button
      onClick={() => onClick(node)}
      className="flex flex-col items-center gap-2 group transition-all duration-200"
    >
      <Avatar
        className={`${avatarSize} border-2 transition-all duration-300 ${
          isSelected
            ? "border-primary shadow-lg shadow-primary/20 scale-105"
            : "border-border group-hover:border-primary/50"
        }`}
      >
        <AvatarImage src={node.imageUrl} alt={node.name} />
        <AvatarFallback className="bg-muted text-muted-foreground font-bold text-xs">
          {node.name.split(" ").map(n => n[0]).join("")}
        </AvatarFallback>
      </Avatar>
      <div className="text-center">
        <p className={`font-bold text-foreground ${textSize} leading-tight group-hover:text-primary transition-colors`}>
          {node.title}
        </p>
        <p className={`text-muted-foreground ${nameSize} mt-0.5`}>
          {node.name}
        </p>
      </div>
    </button>
  );
};

export default OrgTreeSection;
