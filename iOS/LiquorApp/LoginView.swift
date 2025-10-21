import SwiftUI

struct LoginView: View {
    @EnvironmentObject var authManager: AuthenticationManager
    @State private var username = ""
    @State private var password = ""
    @State private var isPasswordVisible = false
    @State private var showingCredentials = false
    
    var body: some View {
        GeometryReader { geometry in
            ZStack {
                // Background gradient
                LinearGradient(
                    gradient: Gradient(colors: [Color.blue.opacity(0.6), Color.purple.opacity(0.4)]),
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
                .ignoresSafeArea()
                
                // Main content
                VStack(spacing: 0) {
                    Spacer()
                    
                    // App logo and title
                    VStack(spacing: 20) {
                        // Logo
                        Image(systemName: "cart.fill")
                            .font(.system(size: 80))
                            .foregroundColor(.white)
                            .shadow(color: .black.opacity(0.3), radius: 10, x: 0, y: 5)
                        
                        // Title
                        VStack(spacing: 8) {
                            Text("Grocery Inventory")
                                .font(.largeTitle)
                                .fontWeight(.bold)
                                .foregroundColor(.white)
                            
                            Text("Management System")
                                .font(.title2)
                                .fontWeight(.medium)
                                .foregroundColor(.white.opacity(0.9))
                        }
                    }
                    .padding(.bottom, 60)
                    
                    // Login form
                    VStack(spacing: 20) {
                        // Username field
                        VStack(alignment: .leading, spacing: 8) {
                            Text("Username")
                                .font(.headline)
                                .foregroundColor(.white)
                            
                            HStack {
                                Image(systemName: "person.fill")
                                    .foregroundColor(.gray)
                                    .frame(width: 20)
                                
                                TextField("Enter username", text: $username)
                                    .textFieldStyle(PlainTextFieldStyle())
                                    .autocapitalization(.none)
                                    .disableAutocorrection(true)
                            }
                            .padding()
                            .background(Color.white.opacity(0.9))
                            .cornerRadius(12)
                            .shadow(color: .black.opacity(0.1), radius: 5, x: 0, y: 2)
                        }
                        
                        // Password field
                        VStack(alignment: .leading, spacing: 8) {
                            Text("Password")
                                .font(.headline)
                                .foregroundColor(.white)
                            
                            HStack {
                                Image(systemName: "lock.fill")
                                    .foregroundColor(.gray)
                                    .frame(width: 20)
                                
                                if isPasswordVisible {
                                    TextField("Enter password", text: $password)
                                        .textFieldStyle(PlainTextFieldStyle())
                                } else {
                                    SecureField("Enter password", text: $password)
                                        .textFieldStyle(PlainTextFieldStyle())
                                }
                                
                                Button(action: {
                                    isPasswordVisible.toggle()
                                }) {
                                    Image(systemName: isPasswordVisible ? "eye.slash.fill" : "eye.fill")
                                        .foregroundColor(.gray)
                                }
                            }
                            .padding()
                            .background(Color.white.opacity(0.9))
                            .cornerRadius(12)
                            .shadow(color: .black.opacity(0.1), radius: 5, x: 0, y: 2)
                        }
                        
                        // Error message
                        if let error = authManager.loginError {
                            HStack {
                                Image(systemName: "exclamationmark.triangle.fill")
                                    .foregroundColor(.red)
                                Text(error)
                                    .foregroundColor(.red)
                                    .font(.body)
                                Spacer()
                            }
                            .padding()
                            .background(Color.white.opacity(0.9))
                            .cornerRadius(8)
                        }
                        
                        // Login button
                        Button(action: {
                            authManager.login(username: username, password: password)
                        }) {
                            HStack {
                                Image(systemName: "arrow.right.circle.fill")
                                Text("Sign In")
                                    .fontWeight(.semibold)
                            }
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(Color.white)
                            .foregroundColor(.blue)
                            .cornerRadius(12)
                            .shadow(color: .black.opacity(0.2), radius: 8, x: 0, y: 4)
                        }
                        .disabled(username.isEmpty || password.isEmpty)
                        .opacity(username.isEmpty || password.isEmpty ? 0.6 : 1.0)
                        
                        // Demo credentials button
                        Button(action: {
                            showingCredentials.toggle()
                        }) {
                            HStack {
                                Image(systemName: "info.circle.fill")
                                Text("View Demo Credentials")
                                    .fontWeight(.medium)
                            }
                            .foregroundColor(.white.opacity(0.8))
                            .padding(.vertical, 8)
                        }
                    }
                    .padding(.horizontal, 40)
                    
                    Spacer()
                    
                    // Footer
                    Text("Powered by Couchbase")
                        .font(.caption)
                        .foregroundColor(.white.opacity(0.7))
                        .padding(.bottom, 30)
                }
            }
        }
        .sheet(isPresented: $showingCredentials) {
            DemoCredentialsView(authManager: authManager)
        }
        .environmentObject(authManager)
    }
}

// MARK: - Demo Credentials View
struct DemoCredentialsView: View {
    let authManager: AuthenticationManager
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        NavigationView {
            List {
                Section(header: Text("Demo User Accounts - Tap to Login")) {
                    ForEach(authManager.getAllUsers(), id: \.username) { user in
                        Button(action: {
                            // Auto-login with this credential
                            let password = getPasswordForUser(user.username)
                            authManager.login(username: user.username, password: password)
                            dismiss()
                        }) {
                            VStack(alignment: .leading, spacing: 4) {
                                HStack {
                                    Text(user.username)
                                        .font(.headline)
                                        .foregroundColor(.primary)
                                    Spacer()
                                    HStack(spacing: 4) {
                                        Text(user.role)
                                            .font(.caption)
                                            .padding(.horizontal, 8)
                                            .padding(.vertical, 2)
                                            .background(Color.blue.opacity(0.1))
                                            .foregroundColor(.blue)
                                            .cornerRadius(4)
                                        
                                        Image(systemName: "arrow.right.circle.fill")
                                            .foregroundColor(.blue)
                                            .font(.system(size: 16))
                                    }
                                }
                                
                                Text(user.fullName)
                                    .font(.subheadline)
                                    .foregroundColor(.secondary)
                                
                                Text("Password: \(getPasswordForUser(user.username))")
                                    .font(.system(.caption, design: .monospaced))
                                    .foregroundColor(.gray)
                            }
                            .padding(.vertical, 4)
                        }
                        .buttonStyle(PlainButtonStyle())
                    }
                }
                
                Section(header: Text("Instructions")) {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("• Tap any credential above to auto-login")
                        Text("• Each user has different role permissions")
                        Text("• Session persists until logout")
                    }
                    .font(.caption)
                    .foregroundColor(.secondary)
                }
            }
            .navigationTitle("Demo Credentials")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Done") {
                        dismiss()
                    }
                }
            }
        }
    }
    
    private func getPasswordForUser(_ username: String) -> String {
        switch username.lowercased() {
        case "admin": return "admin123"
        case "manager": return "manager456"
        case "clerk": return "clerk789"
        case "supervisor": return "super321"
        case "auditor": return "audit654"
        default: return "unknown"
        }
    }
}

// MARK: - Preview
#Preview {
    LoginView()
}
