package com.example.liquorapplication.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val DarkColorScheme = darkColorScheme(
    primary = Color(0xFFFD9B0B),
    secondary = Color(0xFFFFCF95),
    tertiary = Color(0xFFFEF1DB)
)

private val LightColorScheme = lightColorScheme(
    primary = Color(0xFFFD9B0B),
    secondary = Color(0xFFFFCF95),
    tertiary = Color(0xFFFEF1DB)
)

@Composable
fun LiquorApplicationTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = when {
        darkTheme -> DarkColorScheme
        else -> LightColorScheme
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
} 