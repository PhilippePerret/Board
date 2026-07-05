import Foundation

class Backend {

    func run(json: String, completion: @escaping (String) -> Void) {

        let process = Process()
        let pipeIn = Pipe()
        let pipeOut = Pipe()

        let scriptPath = Bundle.main.resourcePath! + "/backend/backend.rb"
        process.executableURL = URL(fileURLWithPath: NSHomeDirectory() + "/.rbenv/versions/3.4.7/bin/ruby")
        process.arguments = [scriptPath]

        process.standardInput = pipeIn
        process.standardOutput = pipeOut
        process.standardError = Pipe()

        do {
            try process.run()
        } catch {
            completion("""
            {"ok": false, "error": "failed to start ruby"}
            """)
            return
        }

        // write input
        if let data = (json + "\n").data(using: .utf8) {
            pipeIn.fileHandleForWriting.write(data)
            pipeIn.fileHandleForWriting.closeFile()
        }

        // read output
        let data = pipeOut.fileHandleForReading.readDataToEndOfFile()

        let output = String(data: data, encoding: .utf8) ?? """
        {"ok": false, "error": "invalid output"}
        """

        completion(output)
    }
}