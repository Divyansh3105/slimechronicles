import { describe, it, expect, beforeEach } from 'vitest';
const { GreatSageWidget } = require('../js/components/GreatSageWidget.js');

describe('GreatSageWidget', () => {
  let widget;

  beforeEach(() => {
    widget = new GreatSageWidget();
  });

  it('should initialize knowledge base with canonical Tensura topics', () => {
    expect(widget.knowledgeBase.length).toBeGreaterThan(5);
    const epTopic = widget.knowledgeBase.find(k => k.patterns.includes('ep'));
    expect(epTopic).toBeDefined();
    expect(epTopic.response).toContain('Existence Value');
  });

  it('should answer known topics accurately', () => {
    let capturedMessage = '';
    widget.typeMessage = (msg) => {
      capturedMessage = msg;
    };

    widget.processQuery('tell me about rimuru skill');
    expect(capturedMessage).toContain('Raphael');
    expect(capturedMessage).toContain('Beelzebuth');

    widget.processQuery('what is existence value');
    expect(capturedMessage).toContain('Existence Value');

    widget.processQuery('who is diablo');
    expect(capturedMessage).toContain('Diablo');
  });

  it('should fallback gracefully for unrecognized queries', () => {
    let capturedMessage = '';
    widget.typeMessage = (msg) => {
      capturedMessage = msg;
    };

    widget.processQuery('completely unknown mystery question');
    expect(capturedMessage).toContain('Report: Analysis of inquiry');
  });
});
