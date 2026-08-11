import Foundation

// Même fichier que backend/lib/debug.rb — log de debug partagé, hors du
// dossier de données (jamais déplacé par les tests).
enum Debug {
    static let logFile = NSHomeDirectory() + "/Library/Application Support/Board-debug.log"

    static func log(_ msg: String) {
        let df = DateFormatter()
        df.dateFormat = "HH:mm:ss.SSS"
        let line = "\(df.string(from: Date())) [swift] \(msg)\n"
        guard let data = line.data(using: .utf8) else { return }
        if let handle = FileHandle(forWritingAtPath: logFile) {
            handle.seekToEndOfFile()
            handle.write(data)
            handle.closeFile()
        } else {
            try? data.write(to: URL(fileURLWithPath: logFile))
        }
    }
}
