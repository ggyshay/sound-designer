import { CardNode } from "../components";

export const findNodeWithId = (id: string, nodes: CardNode[]) => nodes.find((n: CardNode) => n.id === id);