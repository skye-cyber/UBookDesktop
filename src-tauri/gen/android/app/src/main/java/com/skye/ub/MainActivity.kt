package com.skye.ub

import android.os.Bundle
import android.webkit.WebView
import androidx.activity.enableEdgeToEdge

class MainActivity : TauriActivity() {
    private var webView: WebView? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        enableEdgeToEdge()
        super.onCreate(savedInstanceState)
    }

    override fun onWebViewCreate(webView: WebView) {
        super.onWebViewCreate(webView)
        this.webView = webView
    }

    override fun onResume() {
        super.onResume()
        webView?.evaluateJavascript(
            "document.body.style.display='none'; document.body.offsetHeight; document.body.style.display='';",
            null
        )
    }
}
