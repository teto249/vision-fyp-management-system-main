// pages/api/documents.ts
import { NextApiRequest, NextApiResponse } from "next";

const mockDocuments = [
  {
    id: "1",
    fileName: "proposal Recourse 1 - How to Start Your Proposal",
    description: "Guidelines for initiating your project proposal",
    uploadDate: "2023-10-15",
    status: "Opened" as const,
  },
  {
    id: "2",
    fileName: "proposal Recourse 2 - Formatting",
    description: "Document formatting standards and requirements",
    uploadDate: "2023-10-16",
    status: "Opened" as const,
  },
  {
    id: "3",
    fileName: "proposal Recourse 3 - Introduction",
    description: "How to write an effective project introduction",
    uploadDate: "2023-10-17",
    status: "Not Open yet" as const,
  },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(mockDocuments);
}