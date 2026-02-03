import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = 'force-dynamic';

export default async function DebugCollabsPage() {
    let rows: any[] = [];
    let errorMsg = "";

    try {
        const { data, error } = await supabaseAdmin
            .from("collabs")
            .select("id, collab_key, title, cover_url, model_keys")
            .order("collab_key", { ascending: true });

        if (error) throw error;
        rows = data || [];
    } catch (e: any) {
        errorMsg = e.message || String(e);
    }

    if (errorMsg) {
        return <div style={{ padding: 40 }}>Error: {errorMsg}</div>;
    }

    return (
        <main style={{ padding: 40, fontFamily: "monospace", fontSize: 12, background: "#0a0a0f", color: "white" }}>
            <h1>Debug Collabs ({rows.length} rows)</h1>
            <table border={1} cellPadding={8} style={{ borderCollapse: "collapse", width: "100%", marginTop: 20 }}>
                <thead>
                    <tr style={{ background: "#1a1a2e" }}>
                        <th>ID</th>
                        <th>collab_key</th>
                        <th>title</th>
                        <th>cover</th>
                        <th>model_keys</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((r: any) => (
                        <tr key={r.id} style={{ borderBottom: "1px solid #333" }}>
                            <td style={{ padding: 8 }}>{r.id}</td>
                            <td style={{ padding: 8 }}>{r.collab_key || "(null)"}</td>
                            <td style={{ padding: 8 }}>{r.title || "(null)"}</td>
                            <td style={{ padding: 8, textAlign: "center" }}>
                                {r.cover_url ? "✅" : "❌"}
                            </td>
                            <td style={{ padding: 8 }}>{Array.isArray(r.model_keys) ? r.model_keys.join(", ") : "(null)"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </main>
    );
}
