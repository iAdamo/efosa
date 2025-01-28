import React from 'react'
import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'

function MarkdownViewer({ children }) {
    return (
        <Markdown rehypePlugins={[rehypeRaw, rehypeSanitize]}>{children}</Markdown>
    )
}

export default MarkdownViewer