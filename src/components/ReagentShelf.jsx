import { motion } from "framer-motion";
import { reagents, categoryColors, categoryLabels } from "../state/reactionRecipes";
import { Droppable, Draggable } from "@hello-pangea/dnd";

const categoryIcons = {
  acid: "🧪",
  base: "💧",
  salt: "🧂",
  metal: "⚙️",
  oxide: "🔥",
};

function ReagentCard({ reagent, index, onClick, isInBeaker }) {
  const gradientClass = categoryColors[reagent.category] || "from-gray-100 to-gray-50";

  return (
    <Draggable draggableId={reagent.id} index={index}>
      {(provided, snapshot) => (
        <motion.div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onClick(reagent.id)}
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          className={`
            relative cursor-grab active:cursor-grabbing select-none
            rounded-xl p-3 transition-all duration-200
            bg-gradient-to-br ${gradientClass}
            border border-gray-200
            ${snapshot.isDragging ? "ring-2 ring-blue-400 shadow-lg shadow-blue-500/20" : ""}
            ${isInBeaker ? "ring-1 ring-emerald-400 opacity-50" : "hover:border-gray-300 hover:shadow-sm"}
          `}
        >
          {/* Glow dot */}
          <div
            className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: reagent.color, boxShadow: `0 0 6px ${reagent.color}` }}
          />

          <div className="text-xs font-semibold text-gray-500 tracking-wide mb-1">
            {categoryIcons[reagent.category]}
          </div>

          <div className="text-sm font-semibold text-gray-800 leading-tight mb-0.5">
            {reagent.name}
          </div>

          <div
            className="text-xs font-mono font-medium opacity-80"
            style={{ color: reagent.color }}
          >
            {reagent.formula}
          </div>

          {isInBeaker && (
            <div className="absolute inset-0 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <span className="text-[10px] text-emerald-600 font-medium">已添加</span>
            </div>
          )}
        </motion.div>
      )}
    </Draggable>
  );
}

export default function ReagentShelf({ onAddReagent, beakerContents }) {
  // Group reagents by category
  const grouped = {};
  for (const r of reagents) {
    if (!grouped[r.category]) grouped[r.category] = [];
    grouped[r.category].push(r);
  }
  const categories = Object.keys(grouped);
  let globalIndex = 0;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-5 pt-5 pb-3">
        <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
          试剂架
        </h2>
        <p className="text-[11px] text-gray-400 mt-1">拖拽或点击添加试剂</p>
      </div>

      {/* Scrollable reagent list */}
      <Droppable droppableId="reagent-shelf" isDropDisabled={true}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps} className="flex-1 overflow-y-auto px-4 pb-4 space-y-4">
            {categories.map((cat) => (
              <div key={cat}>
                <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-2 px-1">
                  {categoryLabels[cat] || cat}
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {grouped[cat].map((reagent) => {
                    const idx = globalIndex++;
                    return (
                      <ReagentCard
                        key={reagent.id}
                        reagent={reagent}
                        index={idx}
                        onClick={onAddReagent}
                        isInBeaker={beakerContents.includes(reagent.id)}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
