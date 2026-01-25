"use client";

import { ColumnDef } from "@tanstack/react-table";
import { LEDirectoryEntry } from "./data";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export const columns: ColumnDef<LEDirectoryEntry>[] = [
    {
        accessorKey: "platform",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Platform
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        accessorKey: "category",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Category
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        accessorKey: "portalUrl",
        header: "LE Portal / Official URL",
        cell: ({ row }) => {
            const url = row.getValue("portalUrl") as string;
            const portalLink = row.original.portalLink;

            if (portalLink) {
                return (
                    <a
                        href={portalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-blue-600 hover:underline cursor-pointer"
                    >
                        {url}
                    </a>
                );
            }

            return (
                <div className="font-medium text-muted-foreground">
                    {url}
                </div>
            );
        },
    },
    {
        accessorKey: "contact",
        header: "Email / Contact",
        cell: ({ row }) => {
            const contact = row.getValue("contact") as string;
            if (contact === "—") return <span>—</span>;
            return (
                <a href={`mailto:${contact}`} className="text-blue-600 hover:underline">
                    {contact}
                </a>
            );
        },
    },
];
