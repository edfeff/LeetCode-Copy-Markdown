// content.js
console.log("内容脚本已加载，正在监听...");
const turndownService = new TurndownService();

turndownService.addRule("betterStars", {
	// 优化加粗文本的转换
	filter: ["strong", "b"],
	replacement: function (content) {
		return "**" + content + "**" + " ";
	},
});

turndownService.addRule("betterExample", {
	// 优化引用文本的转换
	filter: ["pre"],
	replacement: function (content) {
		// 分割内容为单独的行
		var lines = content.split("\n");
		// 将每行转换为Markdown引用格式
		var blockquoted = lines
			.map(function (line, index) {
				// 检查当前行是否是第一行
				return (index === 0 ? "\n" : "") + "> " + line;
			})
			.join("\n");
		return blockquoted;
	},
});

turndownService.addRule("betterSup", {
	// 优化上标文本的转换
	filter: ["sup"],
	replacement: function (content) {
		return "^" + content;
	},
});

turndownService.addRule("betterSub", {
	// 优化下标文本的转换
	filter: ["sub"],
	replacement: function (content) {
		return "_" + content;
	},
});

turndownService.escape = function (text) {
	// 重写escape方法
	return text.replace(
		/([\\`*{}[\]()#+\-.!_>])|("\*")/g,
		function (match, char, quotedAsterisk) {
			// 如果匹配到被引号包围的星号，转义它
			if (quotedAsterisk) {
				return '"\\*"';
			}

			// 如果匹配到后方括号，不转义
			if (char === "]") {
				return char;
			}

			// 不转义单独的星号
			if (char === "*") {
				return char;
			}

			// 其他情况下，正常转义字符
			return "\\" + char;
		}
	);
};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	console.log("收到消息:", request);
	if (request.action === "getContent") {
		const contentElement = document.querySelector(".elfjS");
		if (contentElement) {
			const markdownContent = turndownService.turndown(contentElement);
			var title = "#" + " " + document.title.split("-")[0] + "\n\n";
			sendResponse({ content: title + markdownContent });
		} else {
			console.error("找不到指定的元素");
			sendResponse({ content: "元素未找到" });
		}
		return true; // 保持消息通道开放以异步发送响应
	}
});

// 创建悬浮按钮
function createFloatingButton() {
	// 检查按钮是否已存在
	if (document.getElementById("leetcode-markdown-btn")) {
		return;
	}

	// 创建按钮元素
	const button = document.createElement("button");
	button.id = "leetcode-markdown-btn";
	button.textContent = "📋 复制Markdown";
	button.style.position = "fixed";
	// button.style.bottom = "20px";
	// button.style.right = "20px";
	button.style.top = "10px";
	button.style.left = "320px";
	button.style.zIndex = "9999";
	button.style.padding = "4px 8px";
	button.style.border = "none";
	button.style.borderRadius = "25px";
	button.style.backgroundColor = "#f48225";
	button.style.color = "white";
	button.style.fontSize = "12px";
	button.style.fontWeight = "bold";
	button.style.cursor = "pointer";
	button.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.2)";
	button.style.transition = "all 0.3s ease";

	// 添加悬停效果
	button.addEventListener("mouseover", function() {
		button.style.backgroundColor = "#e0761f";
		button.style.transform = "scale(1.05)";
	});

	button.addEventListener("mouseout", function() {
		button.style.backgroundColor = "#f48225";
		button.style.transform = "scale(1)";
	});

	// 添加点击事件
	button.addEventListener("click", function() {
		const contentElement = document.querySelector(".elfjS");
		if (contentElement) {
			const markdownContent = turndownService.turndown(contentElement);
			var title = "#" + " " + document.title.split("-")[0] + "\n\n";
			const fullContent = title + markdownContent;

			// 复制到剪贴板
			navigator.clipboard.writeText(fullContent).then(function() {
				// 显示复制成功提示
				const originalText = button.textContent;
				button.textContent = "✅ 已复制";
				button.style.backgroundColor = "#4CAF50";

				setTimeout(function() {
					button.textContent = originalText;
					button.style.backgroundColor = "#f48225";
				}, 2000);
			}).catch(function(err) {
				console.error("复制失败:", err);
				// 显示复制失败提示
				const originalText = button.textContent;
				button.textContent = "❌ 复制失败";
				button.style.backgroundColor = "#f44336";

				setTimeout(function() {
					button.textContent = originalText;
					button.style.backgroundColor = "#f48225";
				}, 2000);
			});
		} else {
			// 显示找不到元素提示
			const originalText = button.textContent;
			button.textContent = "❌ 未找到内容";
			button.style.backgroundColor = "#f44336";

			setTimeout(function() {
				button.textContent = originalText;
				button.style.backgroundColor = "#f48225";
			}, 2000);
		}
	});

	// 将按钮添加到页面
	document.body.appendChild(button);
}

// 当页面加载完成后创建悬浮按钮
window.addEventListener("load", createFloatingButton);

// 当页面内容变化时重新检查并创建悬浮按钮
const observer = new MutationObserver(function(mutations) {
	createFloatingButton();
});

observer.observe(document.body, {
	childList: true,
	subtree: true
});
