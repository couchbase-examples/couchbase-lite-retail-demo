package com.example.liquorapplication

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ShoppingCart
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material.icons.filled.VisibilityOff
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.FocusDirection
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalFocusManager
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import android.util.Log

import androidx.compose.ui.platform.LocalContext
import kotlinx.coroutines.launch

/**
 * Login Screen - Aligned with iOS Implementation
 * Supports both Ann Arbor and NYC store credentials with Couchbase Lite session persistence
 */
@Composable
fun LoginScreen(
    authManager: AuthenticationManager,
    onLoginSuccess: () -> Unit
) {
    var username by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var isPasswordVisible by remember { mutableStateOf(false) }
    var isLoading by remember { mutableStateOf(false) }
    var errorMessage by remember { mutableStateOf<String?>(null) }
    
    val focusManager = LocalFocusManager.current
    val scope = rememberCoroutineScope()
    
    fun handleLogin() {
        when {
            username.isBlank() -> {
                errorMessage = "Please enter username"
                return
            }
            password.isBlank() -> {
                errorMessage = "Please enter password"
                return
            }
        }
        
        isLoading = true
        errorMessage = null
        
        // Authenticate using AuthenticationManager with Couchbase Lite
        scope.launch {
            when (val result = authManager.login(username, password)) {
                is LoginResult.Success -> {
                    Log.d("LoginScreen", "✅ Login successful: ${result.user.fullName}")
                    isLoading = false
                    onLoginSuccess()
                }
                is LoginResult.Error -> {
                    Log.d("LoginScreen", "❌ Login failed: ${result.message}")
                    isLoading = false
                    errorMessage = result.message
                }
            }
        }
    }
    
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                brush = Brush.linearGradient(
                    colors = listOf(
                        Color(0xFFFFCF95).copy(alpha = 0.9f),
                        Color(0xFFFFCF95).copy(alpha = 0.7f)
                    )
                )
            )
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(32.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            // Logo and title
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                Icon(
                    imageVector = Icons.Default.ShoppingCart,
                    contentDescription = "Shopping Cart",
                    modifier = Modifier.size(80.dp),
                    tint = Color.White
                )
                
                Text(
                    text = "Grocery Mart",
                    style = MaterialTheme.typography.headlineLarge,
                    fontWeight = FontWeight.Bold,
                    color = Color.White
                )
                
                Text(
                    text = "Manage your inventory",
                    style = MaterialTheme.typography.titleMedium,
                    color = Color.White.copy(alpha = 0.9f)
                )
            }
            
            Spacer(modifier = Modifier.height(40.dp))
            
            // Login form
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 8.dp),
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(
                    containerColor = Color.White
                )
            ) {
                Column(
                    modifier = Modifier
                        .padding(24.dp),
                    verticalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    // Username field
                    OutlinedTextField(
                        value = username,
                        onValueChange = {
                            username = it
                            errorMessage = null
                        },
                        label = { Text("Username") },
                        placeholder = { Text("aa-store-01@supermarket.com") },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true,
                        keyboardOptions = KeyboardOptions(
                            keyboardType = KeyboardType.Email,
                            imeAction = ImeAction.Next
                        ),
                        keyboardActions = KeyboardActions(
                            onNext = { focusManager.moveFocus(FocusDirection.Down) }
                        ),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = Color(0xFF8E24AA),
                            focusedLabelColor = Color(0xFF8E24AA)
                        )
                    )
                    
                    // Password field
                    OutlinedTextField(
                        value = password,
                        onValueChange = {
                            password = it
                            errorMessage = null
                        },
                        label = { Text("Password") },
                        placeholder = { Text("Enter password") },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true,
                        visualTransformation = if (isPasswordVisible) 
                            VisualTransformation.None 
                        else 
                            PasswordVisualTransformation(),
                        keyboardOptions = KeyboardOptions(
                            keyboardType = KeyboardType.Password,
                            imeAction = ImeAction.Done
                        ),
                        keyboardActions = KeyboardActions(
                            onDone = { 
                                focusManager.clearFocus()
                                handleLogin()
                            }
                        ),
                        trailingIcon = {
                            IconButton(onClick = { isPasswordVisible = !isPasswordVisible }) {
                                Icon(
                                    imageVector = if (isPasswordVisible) 
                                        Icons.Default.Visibility 
                                    else 
                                        Icons.Default.VisibilityOff,
                                    contentDescription = if (isPasswordVisible) 
                                        "Hide password" 
                                    else 
                                        "Show password"
                                )
                            }
                        },
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = Color(0xFF8E24AA),
                            focusedLabelColor = Color(0xFF8E24AA)
                        )
                    )
                    
                    // Error message
                    if (errorMessage != null) {
                        Text(
                            text = errorMessage!!,
                            color = MaterialTheme.colorScheme.error,
                            style = MaterialTheme.typography.bodySmall,
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
                    
                    Spacer(modifier = Modifier.height(8.dp))
                    
                    // Login button
                    Button(
                        onClick = { handleLogin() },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(50.dp),
                        enabled = !isLoading,
                        colors = ButtonDefaults.buttonColors(
                            containerColor = Color(0xFF8E24AA)
                        ),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Text(
                            text = if (isLoading) "Signing in..." else "Sign In",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.SemiBold
                        )
                    }
                    
                    // Helper text
                    Text(
                        text = "Use aa-store-01@supermarket.com or nyc-store-01@supermarket.com",
                        style = MaterialTheme.typography.bodySmall,
                        color = Color.Gray,
                        textAlign = TextAlign.Center,
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            }
            
            Spacer(modifier = Modifier.height(20.dp))
            
            // Store info
            Text(
                text = "Current Store: ${AppConfig.currentStore.displayName}",
                style = MaterialTheme.typography.bodyMedium,
                color = Color.White.copy(alpha = 0.8f),
                fontWeight = FontWeight.Medium
            )
            
            Spacer(modifier = Modifier.height(20.dp))
            
            // Powered by Couchbase
            Text(
                text = "Powered by Couchbase",
                style = MaterialTheme.typography.bodySmall,
                color = Color.White.copy(alpha = 0.7f),
                textAlign = TextAlign.Center
            )
        }
    }
}

