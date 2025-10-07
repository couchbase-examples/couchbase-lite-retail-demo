package com.example.liquorapplication.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val DarkColorScheme = darkColorScheme(
    primary = Color(0xFF8E24AA),
    secondary = Color(0xFF03DAC5),
    tertiary = Color(0xFF3F51B5)
)

private val LightColorScheme = lightColorScheme(
    primary = Color(0xFF8E24AA),
    secondary = Color(0xFF03DAC5),
    tertiary = Color(0xFF3F51B5)
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