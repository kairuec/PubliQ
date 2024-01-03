<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Log;

class InfoGetResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'content' => $this->content,
            'url' => $this->url,
            'image' => $this->image,
            'description' => $this->description,
            'noindex' => $this->noindex,
            'public' => $this->public,
            'tag' => $this->tag,
            'tagUrl' => $this->tagUrl,
            'tagElement' => $this->tagElement,
            'child' => $this->child,
        ];
    }
}
