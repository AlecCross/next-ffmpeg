export default function handler(req, res) {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
    res.status(200).json({ message: "Headers set!" });
}
