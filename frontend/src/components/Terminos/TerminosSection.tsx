import React from "react";

export interface SeccionTerminosProps {
    id: number;
    title: string;
    content: string;
}

/* ------------------------------------------------------------------ */
/*  Formatea el contenido legal en párrafos y listas limpias         */
/* ------------------------------------------------------------------ */
const formatContent = (text: string) => {
    const blocks = text.split("\n\n");

    return blocks.map((block, blockIndex) => {
        const lines = block.split("\n");
        const listItems: string[] = [];
        const proseLines: string[] = [];

        lines.forEach((line) => {
            const trimmed = line.trim();
            if (trimmed.startsWith("- ")) {
                listItems.push(trimmed.slice(2));
            } else {
                proseLines.push(trimmed);
            }
        });

        return (
            <React.Fragment key={blockIndex}>
                {proseLines.length > 0 && (
                    <p className="mb-4 text-slate-700 leading-relaxed text-base">
                        {proseLines.map((line, i) => (
                            <React.Fragment key={i}>
                                {formatInline(line)}
                                {i < proseLines.length - 1 && <br />}
                            </React.Fragment>
                        ))}
                    </p>
                )}
                {listItems.length > 0 && (
                    <ul className="space-y-2 my-4 mb-5">
                        {listItems.map((item, i) => (
                            <li key={i} className="flex items-start gap-3 text-slate-700 text-base">
                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                                <span className="leading-relaxed">{formatInline(item)}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </React.Fragment>
        );
    });
};

/* Convierte **texto** en <strong> */
const formatInline = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
            return (
                <strong key={i} className="font-semibold text-slate-900">
                    {part.slice(2, -2)}
                </strong>
            );
        }
        return <React.Fragment key={i}>{part}</React.Fragment>;
    });
};

const SeccionTerminos = ({ id, title, content }: SeccionTerminosProps) => {
    return (
        <section id={`seccion-${id}`} className="scroll-mt-28 mb-14 last:mb-0">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-5 pb-3 border-b border-slate-200">
                {title}
            </h2>
            <div>{formatContent(content)}</div>
        </section>
    );
};

export default SeccionTerminos;
