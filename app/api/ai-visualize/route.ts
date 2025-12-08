import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { description, items, style = 'realistic' } = await request.json();

    if (!description) {
      return NextResponse.json(
        { success: false, error: 'Description is required' },
        { status: 400 }
      );
    }

    // Build detailed prompt for DALL-E
    const itemsList = items && items.length > 0
      ? items.map((item: any) => `- ${item.category}: ${item.description}`).join('\n')
      : '';

    const prompt = `Professional interior design visualization of a completed home renovation project.

Project Description: ${description}

${itemsList ? `Specific Elements:\n${itemsList}` : ''}

Style: High-quality, realistic, professional architectural photography. Modern, clean, well-lit space. Show the finished result with attention to detail, proper lighting, and professional staging. Make it look inviting and impressive.

Important: Create a photorealistic image that looks like a professionally photographed completed renovation, not a rendering or illustration.`;

    console.log('🎨 Generating AI visualization with DALL-E 3...');
    console.log('Prompt:', prompt.substring(0, 200) + '...');

    // Generate image with DALL-E 3
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: '1024x1024',
      quality: 'hd',
      style: style === 'vivid' ? 'vivid' : 'natural',
    });

    if (!response.data || response.data.length === 0) {
      throw new Error('No image data returned from DALL-E');
    }

    const imageUrl = response.data[0]?.url;

    if (!imageUrl) {
      throw new Error('Failed to generate image');
    }

    console.log('✅ AI visualization generated successfully!');

    return NextResponse.json({
      success: true,
      imageUrl,
      revisedPrompt: response.data[0]?.revised_prompt || null,
      message: 'Visualization generated successfully',
    });
  } catch (error: any) {
    console.error('❌ Error generating AI visualization:', error);
    
    // Handle specific OpenAI errors
    if (error.code === 'content_policy_violation') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Unable to generate image due to content policy. Please adjust your description.' 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to generate visualization' 
      },
      { status: 500 }
    );
  }
}
