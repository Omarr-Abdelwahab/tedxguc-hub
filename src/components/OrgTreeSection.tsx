import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { orgTreesBySeason, OrgNode } from "@/data/mockData";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const currentTree = orgTreesBySeason[Object.keys(orgTreesBySeason).sort((a, b) => Number(b) - Number(a))[0]];

const OrgTreeSection = () => {
  const [selectedNode, setSelectedNode] = useState<OrgNode | null>(currentTree);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);

  const tree = currentTree;

  return (
    <section className="py-24 bg-secondary">
      <div className="container mx-auto px-6">
        <div className="mb-16 text-center">
          <h2 className="text-5xl md:text-6xl font-black text-foreground tracking-tight mb-3">
            Our <span className="text-primary">People</span>
          </h2>
          <p className="text-muted-foreground text-lg">The team behind the ideas</p>
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
                    <button
                      type="button"
                      onClick={() => setImageDialogOpen(true)}
                      className="block rounded-full border-2 border-primary overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={selectedNode.imageUrl} alt={selectedNode.name} />
                        <AvatarFallback className="text-lg font-bold bg-muted text-muted-foreground">
                          {selectedNode.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                    <div>
                      <h3 className="text-xl font-black text-foreground leading-tight">
                        {selectedNode.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {selectedNode.title}
                      </p>
                    </div>
                  </div>

                  <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
                    <DialogContent className="max-w-3xl px-0 py-0 bg-transparent shadow-none sm:rounded-none">
                      <div className="relative overflow-hidden rounded-2xl bg-background shadow-xl">
                        <DialogTitle className="sr-only">{selectedNode.name} photo</DialogTitle>
                        <img
                          src={selectedNode.imageUrl}
                          alt={selectedNode.name}
                          className="block max-h-[80vh] w-full object-cover"
                        />
                      </div>
                    </DialogContent>
                  </Dialog>

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
  const avatarSize = size === "lg" ? "h-32 w-32" : size === "sm" ? "h-28 w-28" : "h-32 w-32";
  const textSize = size === "sm" ? "text-xs" : "text-sm";
  const nameSize = size === "sm" ? "text-[11px]" : "text-[13px]";

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
