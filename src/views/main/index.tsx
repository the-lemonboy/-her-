import {
    Attachments,
    Bubble,
    Conversations,
    Prompts,
    Sender,
    Welcome,
    useXAgent,
    useXChat,
  } from '@ant-design/x';
  import React, { useEffect } from 'react';
  
  import {
    CloudUploadOutlined,
    CommentOutlined,
    EllipsisOutlined,
    FireOutlined,
    HeartOutlined,
    PaperClipOutlined,
    PlusOutlined,
    ReadOutlined,
    ShareAltOutlined,
    SmileOutlined,
  } from '@ant-design/icons';
    import { Badge, Button, type GetProp, Space } from 'antd';
  import useStyle from './style';
import { useChat } from '../../hooks/useChat';
  const renderTitle = (icon: React.ReactElement, title: string) => (
    <Space align="start">
      {icon}
      <span>{title}</span>
    </Space>
  );
  
  const defaultConversationsItems = [
    {
      key: '0',
      label: 'What is Ant Design X?',
    },
  ];
  

  const placeholderPromptsItems: GetProp<typeof Prompts, 'items'> = [
    {
      key: '1',
      label: renderTitle(<FireOutlined style={{ color: '#FF4D4F' }} />, 'Hot Topics'),
      description: 'What are you interested in?',
      children: [
        {
          key: '1-1',
          description: `What's new in X?`,
        },
        {
          key: '1-2',
          description: `What's AGI?`,
        },
        {
          key: '1-3',
          description: `Where is the doc?`,
        },
      ],
    },
    {
      key: '2',
      label: renderTitle(<ReadOutlined style={{ color: '#1890FF' }} />, 'Design Guide'),
      description: 'How to design a good product?',
      children: [
        {
          key: '2-1',
          icon: <HeartOutlined />,
          description: `Know the well`,
        },
        {
          key: '2-2',
          icon: <SmileOutlined />,
          description: `Set the AI role`,
        },
        {
          key: '2-3',
          icon: <CommentOutlined />,
          description: `Express the feeling`,
        },
      ],
    },
  ];
  
  const senderPromptsItems: GetProp<typeof Prompts, 'items'> = [
    {
      key: '1',
      description: 'Hot Topics',
      icon: <FireOutlined style={{ color: '#FF4D4F' }} />,
    },
    {
      key: '2',
      description: 'Design Guide',
      icon: <ReadOutlined style={{ color: '#1890FF' }} />,
    },
  ];
  
  const roles: GetProp<typeof Bubble.List, 'roles'> = {
    ai: {
      placement: 'start',
      typing: { step: 5, interval: 20 },
      styles: {
        content: {
          borderRadius: 16,
        },
      },
    },
    local: {
      placement: 'end',
      variant: 'shadow',
    },
  };
  
  const Independent: React.FC = () => {
    // ==================== Style ====================
    const { styles } = useStyle();
  
    // ==================== State ====================
    const [headerOpen, setHeaderOpen] = React.useState(false);
  
    const [content, setContent] = React.useState('');
  
    const [conversationsItems, setConversationsItems] = React.useState(defaultConversationsItems);
  
    const [activeKey, setActiveKey] = React.useState(defaultConversationsItems[0].key);
  
    const [attachedFiles, setAttachedFiles] = React.useState<GetProp<typeof Attachments, 'items'>>(
      [],
    );
  
    // ==================== Runtime ====================
    const { onRequest, messages, setMessages } = useChat(activeKey);
  
    useEffect(() => {
      if (activeKey !== undefined) {
        setMessages([]);
      }
    }, [activeKey]);
  
    // ==================== Event ====================
    const onSubmit = (nextContent: string) => {
      if (!nextContent) return;
      onRequest(nextContent);
      setContent('');
    };
  
    const onPromptsItemClick: GetProp<typeof Prompts, 'onItemClick'> = (info) => {
      onRequest(info.data.description as string);
    };
  
    const onAddConversation = () => {
      setConversationsItems([
        ...conversationsItems,
        {
          key: `${conversationsItems.length}`,
          label: `New Conversation ${conversationsItems.length}`,
        },
      ]);
      setActiveKey(`${conversationsItems.length}`);
    };
  
    const onConversationClick: GetProp<typeof Conversations, 'onActiveChange'> = (key) => {
      setActiveKey(key);
    };
  
    const handleFileChange: GetProp<typeof Attachments, 'onChange'> = (info) =>
      setAttachedFiles(info.fileList);
  
    // ==================== Nodes ====================
    const placeholderNode = (
      <Space direction="vertical" size={16} className={styles.placeholder}>
        <Welcome
          variant="borderless"
          icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
          title="Hello, I'm Ant Design X"
          description="Base on Ant Design, AGI product interface solution, create a better intelligent vision~"
          extra={
            <Space>
              <Button icon={<ShareAltOutlined />} />
              <Button icon={<EllipsisOutlined />} />
            </Space>
          }
        />
        <Prompts
          title="Do you want?"
          items={placeholderPromptsItems}
          styles={{
            list: {
              width: '100%',
            },
            item: {
              flex: 1,
            },
          }}
          onItemClick={onPromptsItemClick}
        />
      </Space>
    );
  
    const items: GetProp<typeof Bubble.List, 'items'> = messages.map(({ id, message, status }) => ({
      key: id,
      loading: status === 'loading',
      role: status === 'local' ? 'local' : 'ai',
      content: message,
    }));
  
    const attachmentsNode = (
      <Badge dot={attachedFiles.length > 0 && !headerOpen}>
        <Button type="text" icon={<PaperClipOutlined />} onClick={() => setHeaderOpen(!headerOpen)} />
      </Badge>
    );
  
    const senderHeader = (
      <Sender.Header
        title="Attachments"
        open={headerOpen}
        onOpenChange={setHeaderOpen}
        styles={{
          content: {
            padding: 0,
          },
        }}
      >
        <Attachments
          beforeUpload={() => false}
          items={attachedFiles}
          onChange={handleFileChange}
          placeholder={(type) =>
            type === 'drop'
              ? { title: 'Drop file here' }
              : {
                  icon: <CloudUploadOutlined />,
                  title: 'Upload files',
                  description: 'Click or drag files to this area to upload',
                }
          }
        />
      </Sender.Header>
    );
  
    const logoNode = (
      <div className={styles.logo}>
        <img
          src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original"
          draggable={false}
          alt="logo"
        />
        <span>Ant Design X</span>
      </div>
    );
  
    // ==================== Render =================
    return (
      <div className={styles.layout}>
        <div className={styles.menu}>
          {/* 🌟 Logo */}
          {logoNode}
          {/* 🌟 添加会话 */}
          <Button
            onClick={onAddConversation}
            type="link"
            className={styles.addBtn}
            icon={<PlusOutlined />}
          >
            New Conversation
          </Button>
          {/* 🌟 会话管理 */}
          <Conversations
            items={conversationsItems}
            className={styles.conversations}
            activeKey={activeKey}
            onActiveChange={onConversationClick}
          />
        </div>
        <div className={styles.chat}>
          {/* 🌟 消息列表 */}
          <Bubble.List
            items={items.length > 0 ? items : [{ content: placeholderNode, variant: 'borderless' }]}
            roles={roles}
            className={styles.messages}
          />
          {/* 🌟 提示词 */}
          <Prompts items={senderPromptsItems} onItemClick={onPromptsItemClick} />
          {/* 🌟 输入框 */}
          <Sender
            value={content}
            header={senderHeader}
            onSubmit={onSubmit}
            onChange={setContent}
            prefix={attachmentsNode}
            loading={messages.length > 0 && messages[messages.length - 1].status === 'loading'}
            className={styles.sender}
          />
        </div>
      </div>
    );
  };
  
  export default Independent;